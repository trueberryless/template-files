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
  forcePushBranch,
  getAuthentication,
  getHeadCommit,
  getRepositoryUrl,
  hasChangedFile,
  hasChanges,
  stageChanges,
} from "./git.ts";
import { LOCK_FILE, createLockFile, serializeLockFile } from "./lock.ts";
import { applyOperation } from "./operations.ts";
import { getOperations } from "./presets.ts";
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

    for (const operation of operations) {
      applyOperation(operation, TEMPLATES_PATH, checkout);
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

    writeLockFile(checkout, operations);

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
      checkout
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

/**
 * Records what this sync wrote, so a later sync can tell a change made in the repository apart from an outdated file.
 * It is only rewritten together with other changes, so a new template-files commit alone opens no pull requests.
 */
function writeLockFile(checkout: string, operations: Operation[]) {
  const path = join(checkout, LOCK_FILE);
  if (existsSync(path) && !hasChanges(checkout)) return;

  const files: [string, string][] = [];

  for (const operation of operations) {
    const target = join(checkout, operation.target);
    if (operation.type === "delete" || !existsSync(target)) continue;

    files.push([operation.target, readFileSync(target, "utf8")]);
  }

  const commit = process.env["GITHUB_SHA"] ?? getHeadCommit(ROOT_PATH);

  mkdirSync(join(checkout, ".github"), { recursive: true });
  writeFileSync(path, serializeLockFile(createLockFile(commit, files)));
}

function getChangelogEntry(hash: string) {
  const repository =
    process.env["GITHUB_REPOSITORY"] ?? "trueberryless/template-files";

  return `- ci: update GitHub template files - ([${hash}](https://github.com/${repository}/commit/${process.env["GITHUB_SHA"] ?? hash}))`;
}
