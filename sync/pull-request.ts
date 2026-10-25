import { run } from "./shell.ts";

const BRANCH_NAME = "update-template-files";
const LABEL = "🤖 bot";
const TEMPLATE_REPOSITORY = "trueberryless/template-files";

export function getBranchName() {
  return BRANCH_NAME;
}

export function ensureLabel(repository: string) {
  run("gh", [
    "label",
    "create",
    LABEL,
    "--description",
    "Automatically generated pull request",
    "--color",
    "0075ca",
    "--force",
    "-R",
    repository,
  ]);
}

export function findOpenPullRequest(repository: string, cwd: string) {
  const number = run(
    "gh",
    [
      "pr",
      "list",
      "--repo",
      repository,
      "--head",
      BRANCH_NAME,
      "--json",
      "number",
      "--jq",
      ".[0].number",
    ],
    cwd
  );

  return number === "" ? undefined : number;
}

export function closePullRequest(
  repository: string,
  number: string,
  cwd: string
) {
  run(
    "gh",
    [
      "pr",
      "comment",
      number,
      "--repo",
      repository,
      "--body",
      `No template changes are pending for ${repository}.`,
    ],
    cwd
  );
  run("gh", ["pr", "close", number, "--repo", repository], cwd);
}

export function upsertPullRequest(
  repository: string,
  branch: string,
  changelogEntry: string,
  cwd: string
) {
  const existing = findOpenPullRequest(repository, cwd);

  if (existing) {
    const body = run(
      "gh",
      [
        "pr",
        "view",
        existing,
        "--repo",
        repository,
        "--json",
        "body",
        "--jq",
        ".body",
      ],
      cwd
    );

    run(
      "gh",
      [
        "pr",
        "edit",
        existing,
        "--repo",
        repository,
        "--body",
        `${body}\n${changelogEntry}`,
      ],
      cwd
    );

    return run(
      "gh",
      [
        "pr",
        "view",
        existing,
        "--repo",
        repository,
        "--json",
        "url",
        "--jq",
        ".url",
      ],
      cwd
    );
  }

  const body = [
    `This PR syncs the specified GitHub template files from the [central repository](https://github.com/${TEMPLATE_REPOSITORY}).`,
    "",
    "### Changes:",
    changelogEntry,
  ].join("\n");

  return run(
    "gh",
    [
      "pr",
      "create",
      "--repo",
      repository,
      "--base",
      branch,
      "--head",
      BRANCH_NAME,
      "--title",
      "ci: sync template files [skip ci]",
      "--body",
      body,
      "--label",
      LABEL,
    ],
    cwd
  );
}
