import { appendFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  type ExistingLabel,
  type Label,
  type LabelOperation,
  formatLabelOperation,
  getRepositoryLabels,
  planLabelChanges,
  readLabelConfig,
} from "./labels.ts";
import { run } from "./shell.ts";

const owner = process.env["OWNER"] ?? "trueberryless";
const dryRun = process.env["DRY_RUN"] === "true";
const only = process.env["REPOSITORY"];

const config = readLabelConfig(resolve(import.meta.dirname, "../labels.json"));
const repositories = only ? [only] : listRepositories(owner);
const lines = [
  `## ${dryRun ? "Planned label changes" : "Label changes"} for ${repositories.length} repositories`,
  "",
];
let failed = false;

for (const repository of repositories) {
  try {
    const existing = fetchLabels(repository);
    const operations = planLabelChanges(
      existing,
      getRepositoryLabels(config, repository),
      (name) => isLabelUsed(repository, name)
    );

    if (!dryRun) {
      for (const operation of operations) {
        applyOperation(repository, operation);
      }
    }

    const changes = operations.filter(({ type }) => type !== "keep");
    const kept = operations.filter(({ type }) => type === "keep");
    if (changes.length === 0 && kept.length === 0) continue;

    lines.push(
      `- **${repository}**: ${[...changes, ...kept].map(formatLabelOperation).join(", ")}`
    );
  } catch (error) {
    failed = true;
    const message =
      error instanceof Error ? error.message.split("\n")[0] : String(error);
    lines.push(`- **${repository}**: failed, ${message}`);
  }
}

const report = lines.join("\n");

console.info(report);

const summaryPath = process.env["GITHUB_STEP_SUMMARY"];

if (summaryPath) appendFileSync(summaryPath, `${report}\n`);

if (failed) process.exitCode = 1;

function listRepositories(login: string) {
  return run("gh", [
    "repo",
    "list",
    login,
    "--limit",
    "1000",
    "--no-archived",
    "--source",
    "--json",
    "nameWithOwner",
    "--jq",
    ".[].nameWithOwner",
  ])
    .split("\n")
    .filter(Boolean)
    .sort();
}

function fetchLabels(repository: string): ExistingLabel[] {
  return run("gh", [
    "api",
    "--paginate",
    `repos/${repository}/labels?per_page=100`,
    "--jq",
    ".[] | { color, description, name } | tojson",
  ])
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ExistingLabel);
}

function isLabelUsed(repository: string, name: string) {
  return listIssues(repository, name, 1).length > 0;
}

function listIssues(repository: string, name: string, limit?: number) {
  const label = encodeURIComponent(name);
  const path = `repos/${repository}/issues?labels=${label}&state=all&per_page=${limit ?? 100}`;
  const args = limit
    ? ["api", path, "--jq", ".[].number"]
    : ["api", "--paginate", path, "--jq", ".[].number"];

  return run("gh", args).split("\n").filter(Boolean);
}

function applyOperation(repository: string, operation: LabelOperation) {
  switch (operation.type) {
    case "create":
      return gh(
        "POST",
        `repos/${repository}/labels`,
        labelFields(operation.label)
      );
    case "update":
      return gh("PATCH", labelPath(repository, operation.name), [
        ...labelFields(operation.label, "new_name"),
      ]);
    case "rename":
      return gh("PATCH", labelPath(repository, operation.from), [
        ...labelFields(operation.label, "new_name"),
      ]);
    case "merge": {
      // Deleting a label also removes it from every issue, so the issues get the new label first.
      for (const number of listIssues(repository, operation.from)) {
        gh("POST", `repos/${repository}/issues/${number}/labels`, [
          `labels[]=${operation.into}`,
        ]);
      }

      return gh("DELETE", labelPath(repository, operation.from), []);
    }
    case "delete":
      return gh("DELETE", labelPath(repository, operation.name), []);
    case "keep":
      return;
  }
}

function labelFields({ color, description, name }: Label, nameField = "name") {
  return [
    `${nameField}=${name}`,
    `color=${color}`,
    `description=${description}`,
  ];
}

function labelPath(repository: string, name: string) {
  return `repos/${repository}/labels/${encodeURIComponent(name)}`;
}

function gh(method: string, path: string, fields: string[]) {
  run("gh", [
    "api",
    "-X",
    method,
    path,
    "--silent",
    ...fields.flatMap((field) => ["-f", field]),
  ]);
}
