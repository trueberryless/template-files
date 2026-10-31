import type { SyncSummary } from "./types.ts";

export function formatTable(items: SyncSummary[], links: string | undefined) {
  const rows = items.map(
    ({ changedFiles, pullRequestUrl, repository }) =>
      `| ${repository} | ${pullRequestUrl ? `[PR Link](${pullRequestUrl})` : "No PR"} | ${changedFiles} |`
  );

  return [
    "### Summary of Changes",
    "",
    "| Repository | PR Link | Files Changed |",
    "|------------|---------|---------------|",
    ...rows,
    "",
    ...(links ? [links, ""] : []),
  ].join("\n");
}

export function formatWorkflowLinks(
  serverUrl: string | undefined,
  repository: string | undefined
) {
  if (!serverUrl || !repository) return undefined;

  const workflows = `${serverUrl}/${repository}/actions/workflows`;

  return [
    "### Next steps",
    "",
    `- [Merge all sync pull requests](${workflows}/merge-sync-prs.yaml) with green checks, or try a dry run first.`,
    `- [Sync one repository](${workflows}/sync-repository.yaml) again, for example after a merge conflict.`,
  ].join("\n");
}
