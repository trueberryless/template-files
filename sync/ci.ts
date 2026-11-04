import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Document, isMap, isScalar, isSeq, parseDocument } from "yaml";

const PLAYWRIGHT_CONFIGS = [
  "playwright.config.ts",
  "playwright.config.mts",
  "playwright.config.js",
  "playwright.config.mjs",
];
const PNPM_COMMANDS = new Set(["add", "dlx", "exec", "i", "install", "run"]);
const PNPM_SCRIPT_RE = /^pnpm\s+(?:--silent\s+)?(?:run\s+)?([\w:.-]+)/;

export interface Project {
  hasPlaywright: boolean;
  scripts: Set<string>;
}

export function readProject(path: string): Project {
  const packageJsonPath = join(path, "package.json");
  const packageJson = existsSync(packageJsonPath)
    ? (JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
        scripts?: Record<string, string>;
      })
    : {};

  return {
    hasPlaywright: PLAYWRIGHT_CONFIGS.some((name) =>
      existsSync(join(path, name))
    ),
    scripts: new Set(Object.keys(packageJson.scripts ?? {})),
  };
}

/**
 * Trims the CI workflow template to what a repository can run: steps that call a missing `package.json` script are
 * removed, the end-to-end job only stays with a Playwright config, the test job falls back to `pnpm test` without a
 * `test:coverage` script, and the final `ci` job only waits for the jobs that are left. Returns `undefined` when no job
 * is left, because the repository has nothing for CI to run.
 */
export function adaptCiWorkflow(
  template: string,
  project: Project
): string | undefined {
  const document = parseDocument(template);
  const jobs = document.get("jobs");
  if (!isMap(jobs)) return template;

  if (!project.hasPlaywright) jobs.delete("e2e");
  adaptTestJob(document, project);

  for (const pair of jobs.items) {
    const steps = document.getIn(["jobs", pair.key, "steps"]);
    if (!isSeq(steps)) continue;

    steps.items = steps.items.filter((step) => {
      const run = isMap(step) ? step.get("run") : undefined;
      const script = typeof run === "string" ? getScript(run) : undefined;

      return script === undefined || project.scripts.has(script);
    });
  }

  const names = jobs.items.map(({ key }) => String(key));

  for (const name of names) {
    if (name !== "ci" && !hasScriptStep(document, name)) jobs.delete(name);
  }

  const remaining = new Set(
    jobs.items.map(({ key }) => String(key)).filter((name) => name !== "ci")
  );
  if (remaining.size === 0) return undefined;

  const needs = document.getIn(["jobs", "ci", "needs"]);

  if (isSeq(needs)) {
    needs.items = needs.items.filter(
      (item) => isScalar(item) && remaining.has(String(item.value))
    );
  }

  return document.toString({ flowCollectionPadding: false, lineWidth: 0 });
}

function adaptTestJob(document: Document, { scripts }: Project) {
  if (scripts.has("test:coverage") || !scripts.has("test")) return;

  const steps = document.getIn(["jobs", "test", "steps"]);
  if (!isSeq(steps)) return;

  // Without a coverage script there is no report to summarize or upload, so only the plain test run stays.
  steps.items = steps.items.flatMap((step) => {
    if (!isMap(step)) return [step];

    const run = step.get("run");
    const name = String(step.get("name") ?? "");

    if (typeof run === "string" && getScript(run) === "test:coverage") {
      step.set("run", "pnpm test");
      if (name) step.set("name", name.replace(/ with coverage$/i, ""));
      return [step];
    }

    return /coverage/i.test(name) ? [] : [step];
  });
}

function hasScriptStep(document: Document, job: string) {
  const steps = document.getIn(["jobs", job, "steps"]);
  if (!isSeq(steps)) return false;

  return steps.items.some((step) => {
    const run = isMap(step) ? step.get("run") : undefined;
    return typeof run === "string" && /\bpnpm\s+(?!install\b)/.test(run);
  });
}

function getScript(run: string) {
  const script = PNPM_SCRIPT_RE.exec(run.trim())?.[1];
  return script && !PNPM_COMMANDS.has(script) ? script : undefined;
}
