import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import {
  addMissingLines,
  mergeJsonText,
  mergeYamlText,
  replaceSection,
} from "./content.ts";
import { mergeTextFiles } from "./git.ts";
import { renderTemplate } from "./props.ts";
import { type MergeResult, mergeSyncedFile } from "./three-way.ts";
import type { Operation, Props } from "./types.ts";

export interface SyncContext {
  /** The hash of each target as the lock file recorded it at the last sync. */
  baseHashes: Record<string, string>;
  /** Renders a template source as it was at the last sync. */
  renderBase: (source: string, props: Props) => string | undefined;
}

export interface OperationResult {
  merge?: MergeResult;
  /** What the template-files side of the target is now, recorded in the lock file as the next sync's base. */
  theirs?: string;
}

export function applyOperation(
  operation: Operation,
  templatesPath: string,
  targetPath: string,
  context?: SyncContext
): OperationResult {
  const target = join(targetPath, operation.target);

  if (operation.type === "delete") {
    rmSync(target, { force: true });
    return {};
  }

  const template = renderTemplate(
    readFileSync(join(templatesPath, operation.source), "utf8"),
    operation.props
  );
  const existing = existsSync(target)
    ? readFileSync(target, "utf8")
    : undefined;

  mkdirSync(dirname(target), { recursive: true });

  if (operation.type === "copy" && context) {
    const merge = mergeSyncedFile(
      {
        baseHash: context.baseHashes[operation.target],
        getBase: () => context.renderBase(operation.source, operation.props),
        ours: existing,
        theirs: template,
      },
      mergeTextFiles
    );

    writeFileSync(target, merge.content);
    return { merge, theirs: template };
  }

  const content = getContent(operation.type, existing, template);

  writeFileSync(target, content);
  return { theirs: content };
}

function getContent(
  type: Exclude<Operation["type"], "delete">,
  existing: string | undefined,
  template: string
) {
  switch (type) {
    case "copy": {
      return template;
    }
    case "merge-json": {
      return mergeJsonText(existing, template);
    }
    case "merge-yaml": {
      return mergeYamlText(existing, template);
    }
    case "add-missing-lines": {
      return addMissingLines(existing, template);
    }
    case "replace-license": {
      return replaceSection(existing, template, "License");
    }
  }
}
