import { readFileSync } from "node:fs";
import { z } from "zod";

const LabelSchema = z.object({
  aliases: z.array(z.string()).default([]),
  color: z
    .string()
    .regex(/^[0-9a-fA-F]{6}$/)
    .transform((color) => color.toUpperCase()),
  description: z.string().max(100).default(""),
  name: z.string().min(1).max(50),
});

const LabelConfigSchema = z.object({
  labels: z.array(LabelSchema).min(1),
  repositories: z
    .record(z.string().regex(/^[\w.-]+\/[\w.-]+$/), z.array(LabelSchema))
    .default({}),
});

export type Label = z.output<typeof LabelSchema>;
export type LabelConfig = z.output<typeof LabelConfigSchema>;

export interface ExistingLabel {
  color: string;
  description: string | null;
  name: string;
}

export type LabelOperation =
  | { label: Label; type: "create" }
  | { label: Label; name: string; type: "update" }
  | { from: string; label: Label; type: "rename" }
  | { from: string; into: string; type: "merge" }
  | { name: string; type: "delete" }
  | { name: string; type: "keep" };

export function parseLabelConfig(input: unknown): LabelConfig {
  const config = LabelConfigSchema.parse(input);

  for (const [repository, extra] of Object.entries(config.repositories)) {
    const names: string[] = [];

    for (const { aliases, name } of [...config.labels, ...extra]) {
      names.push(name, ...aliases);
    }

    const duplicate = names.find(
      (name, index) =>
        names.findIndex((other) => isSameName(other, name)) !== index
    );

    if (duplicate) {
      throw new Error(
        `The label '${duplicate}' is defined more than once for '${repository}'.`
      );
    }
  }

  return config;
}

export function readLabelConfig(path: string) {
  return parseLabelConfig(JSON.parse(readFileSync(path, "utf8")));
}

export function getRepositoryLabels(config: LabelConfig, repository: string) {
  return [...config.labels, ...(config.repositories[repository] ?? [])];
}

/**
 * Plans the changes that turn a repository's labels into the wanted ones. Aliases are renamed or merged so issues keep
 * their labels, and any other label is only deleted when no issue or pull request uses it.
 */
export function planLabelChanges(
  existing: ExistingLabel[],
  wanted: Label[],
  isUsed: (name: string) => boolean
): LabelOperation[] {
  const operations: LabelOperation[] = [];
  const handled = new Set<string>();

  for (const label of wanted) {
    const current = existing.find(({ name }) => isSameName(name, label.name));
    const aliases = existing.filter(({ name }) =>
      label.aliases.some((alias) => isSameName(alias, name))
    );

    if (current) {
      handled.add(current.name);
      if (!isUpToDate(current, label)) {
        operations.push({ label, name: current.name, type: "update" });
      }
    } else if (aliases[0]) {
      handled.add(aliases[0].name);
      operations.push({ from: aliases[0].name, label, type: "rename" });
      aliases.shift();
    } else {
      operations.push({ label, type: "create" });
    }

    for (const alias of aliases) {
      handled.add(alias.name);
      operations.push({ from: alias.name, into: label.name, type: "merge" });
    }
  }

  for (const { name } of existing) {
    if (handled.has(name)) continue;

    operations.push({ name, type: isUsed(name) ? "keep" : "delete" });
  }

  return operations;
}

export function formatLabelOperation(operation: LabelOperation) {
  switch (operation.type) {
    case "create":
      return `create \`${operation.label.name}\``;
    case "update":
      return `update \`${operation.name}\``;
    case "rename":
      return `rename \`${operation.from}\` to \`${operation.label.name}\``;
    case "merge":
      return `move \`${operation.from}\` to \`${operation.into}\``;
    case "delete":
      return `delete unused \`${operation.name}\``;
    case "keep":
      return `keep \`${operation.name}\` (in use, not in labels.json)`;
  }
}

function isUpToDate(current: ExistingLabel, label: Label) {
  return (
    current.name === label.name &&
    current.color.toUpperCase() === label.color &&
    (current.description ?? "") === label.description
  );
}

function isSameName(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}
