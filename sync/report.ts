import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { formatTable, formatWorkflowLinks } from "./summary.ts";
import type { SyncSummary } from "./types.ts";

const directory = resolve(process.argv[2] ?? "summary");

const summaries = readdirSync(directory)
  .filter((file) => file.endsWith(".json"))
  .map(
    (file) =>
      JSON.parse(readFileSync(join(directory, file), "utf8")) as SyncSummary
  )
  .toSorted((a, b) => a.repository.localeCompare(b.repository));

const links = formatWorkflowLinks(
  process.env["GITHUB_SERVER_URL"],
  process.env["GITHUB_REPOSITORY"]
);

writeFileSync(
  join(directory, "final_summary.md"),
  formatTable(summaries, links)
);
