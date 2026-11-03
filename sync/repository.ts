import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sortPackageJson from "sort-package-json";

import type { Repository } from "./config.ts";
import {
  cloneRepository,
  commitChanges,
  createBranch,
  diffTexts,
  forcePushBranch,
  getAuthentication,
  getHeadCommit,
  getRepositoryUrl,
  hasChangedFile,
  hasChanges,
  readFileAtCommit,
  stageChanges,
} from "./git.ts";
import {
  LOCK_FILE,
  type LockFile,
  createLockFile,
  parseLockFile,
  serializeLockFile,
} from "./lock.ts";
import { type SyncContext, applyOperation } from "./operations.ts";
import { getOperations } from "./presets.ts";
import { renderTemplate } from "./props.ts";
import {
  closePullRequest,
  ensureLabel,
  findOpenPullRequest,
  getBranchName,
  upsertPullRequest,
} from "./pull-request.ts";
import { run } from "./shell.ts";
import type { Operation, SyncSummary } from "./types.ts";

const ROOT_PATH = resolve(import.meta.dirname, "..");
const TEMPLATES_PATH = join(ROOT_PATH, "templates");

export function syncRepository(
  repository: Repository,
  token: string
): SyncSummary {
  const workspace = mkdtempSync(join(tmpdir(), "sync-"));
  const checkout = join(workspace, "target");
  const authentication = getAuthentication(token);

  try {
    cloneRepository(
      getRepositoryUrl(repository.name),
      checkout,
      authentication
    );
    createBranch(checkout, getBranchName());

    const operations = getOperations(repository);
    const context = createSyncContext(readLockFile(checkout));
    const templateVersions = new Map<string, string>();
    const conflicts: string[] = [];

    for (const operation of operations) {
      const result = applyOperation(
        operation,
        TEMPLATES_PATH,
        checkout,
        context
      );

      if (operation.type === "copy" && result.theirs !== undefined) {
        templateVersions.set(operation.target, result.theirs);

        if (result.merge?.type === "conflict") {
          const base = context.renderBase(operation.source, operation.props);
          conflicts.push(
            formatConflict(
              operation.target,
              diffTexts(
                base ?? result.merge.content,
                result.theirs,
                operation.target
              )
            )
          );
        }
      }
    }

    const packageJsonTargets = new Set(
      operations
        .filter(({ target }) => target.endsWith("package.json"))
        .map(({ target }) => target)
    );

    for (const target of packageJsonTargets) {
      const path = join(checkout, target);
      writeFileSync(path, sortPackageJson(readFileSync(path, "utf8")));
    }

    if (hasChangedFile(checkout, "package.json")) {
      run(
        "pnpm",
        ["install", "--no-frozen-lockfile", "--ignore-scripts"],
        checkout
      );
    }

    writeLockFile(checkout, operations, templateVersions, conflicts.length > 0);

    const changedFiles = stageChanges(checkout).length;

    if (changedFiles === 0) {
      const open = findOpenPullRequest(repository.name, checkout);

      if (open) {
        closePullRequest(repository.name, open, checkout);
      }

      return {
        changedFiles,
        pullRequestUrl: undefined,
        repository: repository.name,
      };
    }

    ensureLabel(repository.name);

    const hash = commitChanges(checkout, "ci: update GitHub template files");

    forcePushBranch(checkout, getBranchName(), authentication);

    const pullRequestUrl = upsertPullRequest(
      repository.name,
      repository.branch,
      getChangelogEntry(hash),
      checkout,
      formatConflicts(conflicts)
    );

    return { changedFiles, pullRequestUrl, repository: repository.name };
  } finally {
    rmSync(workspace, { force: true, recursive: true });
  }
}

export function writeSummary(summary: SyncSummary, directory: string) {
  mkdirSync(directory, { recursive: true });
  writeFileSync(
    join(directory, `${summary.repository.replace("/", "-")}.json`),
    JSON.stringify(summary)
  );
}

function readLockFile(checkout: string) {
  const path = join(checkout, LOCK_FILE);

  return existsSync(path)
    ? parseLockFile(readFileSync(path, "utf8"))
    : undefined;
}

function createSyncContext(lockFile: LockFile | undefined): SyncContext {
  return {
    baseHashes: lockFile?.files ?? {},
    renderBase: (source, props) => {
      if (!lockFile) return undefined;

      const template = readFileAtCommit(
        ROOT_PATH,
        lockFile.commit,
        `templates/${source}`
      );
      if (template === undefined) return undefined;

      try {
        return renderTemplate(template, props);
      } catch {
        // An older template can use a placeholder the repository has no value for anymore.
        return undefined;
      }
    },
  };
}

/**
 * Records what the template side of every synced file looked like, so the next sync can tell a change made in the
 * repository apart from an outdated file. It is only rewritten together with other changes or kept template changes,
 * so a new template-files commit alone opens no pull requests.
 */
function writeLockFile(
  checkout: string,
  operations: Operation[],
  templateVersions: Map<string, string>,
  force: boolean
) {
  const path = join(checkout, LOCK_FILE);
  if (existsSync(path) && !hasChanges(checkout) && !force) return;

  const files: [string, string][] = [];

  for (const operation of operations) {
    const target = join(checkout, operation.target);
    if (operation.type === "delete") continue;

    const templateVersion = templateVersions.get(operation.target);

    if (templateVersion !== undefined) {
      files.push([operation.target, templateVersion]);
    } else if (existsSync(target)) {
      files.push([operation.target, readFileSync(target, "utf8")]);
    }
  }

  const commit = process.env["GITHUB_SHA"] ?? getHeadCommit(ROOT_PATH);

  mkdirSync(join(checkout, ".github"), { recursive: true });
  writeFileSync(path, serializeLockFile(createLockFile(commit, files)));
}

function formatConflict(target: string, diff: string) {
  return [
    `<details><summary><code>${target}</code></summary>`,
    "",
    "```diff",
    diff,
    "```",
    "",
    "</details>",
  ].join("\n");
}

function formatConflicts(conflicts: string[]) {
  if (conflicts.length === 0) return undefined;

  return [
    "### Not applied",
    "",
    "These files were changed in this repository and in the template, so the sync kept this repository's version. The template changes are below if you want to apply them by hand.",
    "",
    ...conflicts,
  ].join("\n");
}

function getChangelogEntry(hash: string) {
  const repository =
    process.env["GITHUB_REPOSITORY"] ?? "trueberryless/template-files";

  return `- ci: update GitHub template files - ([${hash}](https://github.com/${repository}/commit/${process.env["GITHUB_SHA"] ?? hash}))`;
}
