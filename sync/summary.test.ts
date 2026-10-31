import { describe, expect, test } from "vitest";

import { formatTable, formatWorkflowLinks } from "./summary.ts";

const summaries = [
  { changedFiles: 2, pullRequestUrl: "https://github.com/owner/a/pull/1", repository: "owner/a" },
  { changedFiles: 0, pullRequestUrl: undefined, repository: "owner/b" },
];

describe("formatWorkflowLinks", () => {
  test("links the merge and single repository workflows", () => {
    expect(formatWorkflowLinks("https://github.com", "owner/template-files")).toBe(
      [
        "### Next steps",
        "",
        "- [Merge all sync pull requests](https://github.com/owner/template-files/actions/workflows/merge-sync-prs.yaml) with green checks, or try a dry run first.",
        "- [Sync one repository](https://github.com/owner/template-files/actions/workflows/sync-repository.yaml) again, for example after a merge conflict.",
      ].join("\n")
    );
  });

  test("returns nothing outside of GitHub Actions", () => {
    expect(formatWorkflowLinks(undefined, "owner/template-files")).toBeUndefined();
    expect(formatWorkflowLinks("https://github.com", undefined)).toBeUndefined();
  });
});

describe("formatTable", () => {
  test("lists every repository and appends the links", () => {
    expect(formatTable(summaries, "LINKS")).toBe(
      [
        "### Summary of Changes",
        "",
        "| Repository | PR Link | Files Changed |",
        "|------------|---------|---------------|",
        "| owner/a | [PR Link](https://github.com/owner/a/pull/1) | 2 |",
        "| owner/b | No PR | 0 |",
        "",
        "LINKS",
        "",
      ].join("\n")
    );
  });

  test("leaves the links out when there are none", () => {
    expect(formatTable([], undefined)).not.toContain("Next steps");
  });
});

