import {
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
  getRepositoryUrl,
  hasChangedFile,
  stageChanges,
} from "./git.ts";
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
import type { SyncSummary } from "./types.ts";

const TEMPLATES_PATH = resolve(import.meta.dirname, "../templates");

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

function getChangelogEntry(hash: string) {
  const repository =
    process.env["GITHUB_REPOSITORY"] ?? "trueberryless/template-files";

  return `- ci: update GitHub template files - ([${hash}](https://github.com/${repository}/commit/${process.env["GITHUB_SHA"] ?? hash}))`;
}
