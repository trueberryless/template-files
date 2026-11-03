import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { run } from "./shell.ts";
import type { TextMerge } from "./three-way.ts";

const BOT_NAME = "github-actions[bot]";
const BOT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com";

export function getRepositoryUrl(name: string) {
  return `https://github.com/${name}.git`;
}

export function getAuthentication(
  token: string,
  environment: NodeJS.ProcessEnv = process.env
): NodeJS.ProcessEnv {
  const credentials = Buffer.from(`x-access-token:${token}`).toString("base64");
  const index =
    Number.parseInt(environment["GIT_CONFIG_COUNT"] ?? "0", 10) || 0;

  return {
    GIT_CONFIG_COUNT: String(index + 1),
    [`GIT_CONFIG_KEY_${index}`]: "http.https://github.com/.extraheader",
    [`GIT_CONFIG_VALUE_${index}`]: `Authorization: Basic ${credentials}`,
  };
}

export const BOT_IDENTITY = {
  GIT_AUTHOR_EMAIL: BOT_EMAIL,
  GIT_AUTHOR_NAME: BOT_NAME,
  GIT_COMMITTER_EMAIL: BOT_EMAIL,
  GIT_COMMITTER_NAME: BOT_NAME,
} as const;

export function cloneRepository(
  url: string,
  directory: string,
  authentication?: NodeJS.ProcessEnv
) {
  run(
    "git",
    ["clone", "--depth", "1", url, directory],
    undefined,
    authentication
  );
}

export function createBranch(directory: string, branch: string) {
  run("git", ["checkout", "-B", branch], directory);
}

export function stageChanges(directory: string) {
  run("git", ["add", "--all"], directory);

  return run("git", ["diff", "--cached", "--name-only"], directory)
    .split("\n")
    .filter(Boolean);
}

export function hasChanges(directory: string) {
  return run("git", ["status", "--porcelain"], directory) !== "";
}

export function getHeadCommit(directory: string) {
  return run("git", ["rev-parse", "HEAD"], directory);
}

export function hasChangedFile(directory: string, fileName: string) {
  return run("git", ["status", "--porcelain"], directory)
    .split("\n")
    .some(
      (line) =>
        line === fileName ||
        line.endsWith(`/${fileName}`) ||
        line.endsWith(` ${fileName}`)
    );
}

export function commitChanges(directory: string, message: string) {
  run("git", ["commit", "--message", message], directory, BOT_IDENTITY);

  return run("git", ["rev-parse", "--short", "HEAD"], directory);
}

export function forcePushBranch(
  directory: string,
  branch: string,
  authentication?: NodeJS.ProcessEnv
) {
  run("git", ["push", "--force", "origin", branch], directory, authentication);
}

/**
 * Merges the changes from `base` to `theirs` into `ours` with `git merge-file`, which exits with the number of
 * conflicts it left in the result.
 */
export function mergeTextFiles(
  ours: string,
  base: string,
  theirs: string
): TextMerge {
  return withTextFiles({ base, ours, theirs }, (paths) => {
    const result = spawnSync(
      "git",
      ["merge-file", "-p", paths.ours, paths.base, paths.theirs],
      { encoding: "utf8" }
    );

    if (result.status === null || result.status < 0) {
      throw new Error(`git merge-file failed: ${result.stderr}`);
    }

    return { content: result.stdout, isClean: result.status === 0 };
  });
}

/** Returns a unified diff from `before` to `after`, labelled with the file's path. */
export function diffTexts(before: string, after: string, path: string) {
  return withTextFiles({ after, before }, (paths) => {
    const result = spawnSync(
      "git",
      ["diff", "--no-index", "--no-color", "--", paths.before, paths.after],
      { encoding: "utf8" }
    );

    return result.stdout
      .split("\n")
      .filter(
        (line) => !line.startsWith("diff --git") && !line.startsWith("index ")
      )
      .map((line) =>
        line.startsWith("--- ")
          ? `--- a/${path}`
          : line.startsWith("+++ ")
            ? `+++ b/${path}`
            : line
      )
      .join("\n")
      .trimEnd();
  });
}

/** Reads a file of a repository at a commit, fetching the commit first when a shallow clone does not have it. */
export function readFileAtCommit(
  directory: string,
  commit: string,
  path: string
) {
  const show = () =>
    spawnSync("git", ["show", `${commit}:${path}`], {
      cwd: directory,
      encoding: "utf8",
    });

  let result = show();

  if (result.status !== 0) {
    spawnSync("git", ["fetch", "--depth=1", "origin", commit], {
      cwd: directory,
      encoding: "utf8",
    });
    result = show();
  }

  return result.status === 0 ? result.stdout : undefined;
}

function withTextFiles<Name extends string, Result>(
  contents: Record<Name, string>,
  callback: (paths: Record<Name, string>) => Result
) {
  const directory = mkdtempSync(join(tmpdir(), "three-way-"));

  try {
    const paths = {} as Record<Name, string>;

    for (const [name, content] of Object.entries(contents) as [
      Name,
      string,
    ][]) {
      paths[name] = join(directory, name);
      writeFileSync(paths[name], content);
    }

    return callback(paths);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
}
