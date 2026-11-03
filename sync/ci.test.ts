import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { parse } from "yaml";

import { type Project, adaptCiWorkflow } from "./ci.ts";

const TEMPLATE = readFileSync(
  resolve(import.meta.dirname, "../templates/.github/workflows/ci.yaml"),
  "utf8"
);
const ALL_SCRIPTS = ["build", "check", "format:check", "knip", "lint", "test", "test:coverage"];

function project(scripts: string[], hasPlaywright = false): Project {
  return { hasPlaywright, scripts: new Set(scripts) };
}

function adapt(input: Project) {
  return parse(adaptCiWorkflow(TEMPLATE, input)) as {
    jobs: Record<string, { needs?: string[]; steps?: { name?: string; run?: string }[] }>;
  };
}

function runs(workflow: ReturnType<typeof adapt>, job: string) {
  return (workflow.jobs[job]?.steps ?? []).flatMap(({ run }) => (run ? [run] : []));
}

describe("adaptCiWorkflow", () => {
  test("keeps the template as it is when the repository has every script", () => {
    expect(adaptCiWorkflow(TEMPLATE, project(ALL_SCRIPTS, true))).toBe(TEMPLATE);
  });

  test("removes steps whose script is missing", () => {
    const workflow = adapt(project(["build", "lint"]));

    expect(runs(workflow, "check")).toEqual([
      "pnpm install --frozen-lockfile",
      "pnpm lint",
      "pnpm build",
    ]);
  });

  test("removes the end-to-end job without a Playwright config", () => {
    const workflow = adapt(project(ALL_SCRIPTS));

    expect(workflow.jobs["e2e"]).toBeUndefined();
    expect(workflow.jobs["ci"]?.needs).toEqual(["check", "test", "supply-chain"]);
  });

  test("runs the plain test script without a coverage script", () => {
    const workflow = adapt(project(["build", "test"]));

    expect(runs(workflow, "test")).toEqual(["pnpm install --frozen-lockfile", "pnpm test"]);
    expect(workflow.jobs["test"]?.steps?.some(({ name }) => /coverage/i.test(name ?? ""))).toBe(false);
  });

  test("keeps only the supply chain job for a repository without scripts", () => {
    const workflow = adapt(project([]));

    expect(Object.keys(workflow.jobs)).toEqual(["supply-chain", "ci"]);
    expect(workflow.jobs["ci"]?.needs).toEqual(["supply-chain"]);
  });
});
