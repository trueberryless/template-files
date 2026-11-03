import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

import { adaptCiWorkflow, readProject } from "./ci.ts";
import {
  addMissingLines,
  mergeJsonText,
  mergeYamlText,
  replaceSection,
} from "./content.ts";
import { renderTemplate } from "./props.ts";
import type { Operation } from "./types.ts";

export function applyOperation(
  operation: Operation,
  templatesPath: string,
  targetPath: string
) {
  const target = join(targetPath, operation.target);

  if (operation.type === "delete") {
    rmSync(target, { force: true });
    return;
  }

  const template = renderTemplate(
    readFileSync(join(templatesPath, operation.source), "utf8"),
    operation.props
  );
  const existing = existsSync(target)
    ? readFileSync(target, "utf8")
    : undefined;

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    operation.type === "ci"
      ? adaptCiWorkflow(template, readProject(targetPath))
      : getContent(operation.type, existing, template)
  );
}

function getContent(
  type: Exclude<Operation["type"], "delete" | "ci">,
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
