export type Preset = "site" | "plugin" | "tooling";

export type Props = Record<string, string>;

export type Operation =
  | { type: "copy"; source: string; target: string; props: Props }
  | { type: "ci"; source: string; target: string; props: Props }
  | { type: "merge-json"; source: string; target: string; props: Props }
  | { type: "merge-yaml"; source: string; target: string; props: Props }
  | { type: "add-missing-lines"; source: string; target: string; props: Props }
  | { type: "replace-license"; source: string; target: string; props: Props }
  | { type: "delete"; target: string };

export interface SyncSummary {
  changedFiles: number;
  pullRequestUrl: string | undefined;
  repository: string;
}
