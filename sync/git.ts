import { run } from "./shell.ts";

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
