import { describe, expect, test } from "vitest";

import { mergeValues } from "./three-way-values.ts";

describe("mergeValues", () => {
  const base = { scripts: { lint: "oxlint", test: "vitest run" }, type: "module" };

  test("updates a key the repository left as it was", () => {
    const ours = { name: "site", scripts: { lint: "oxlint", test: "vitest run" }, type: "module" };
    const theirs = { scripts: { lint: "oxlint --deny-warnings", test: "vitest run" }, type: "module" };

    expect(mergeValues(ours, base, theirs, "json")).toEqual({
      conflicts: [],
      value: { name: "site", scripts: { lint: "oxlint --deny-warnings", test: "vitest run" }, type: "module" },
    });
  });

  test("keeps a key the repository changed and reports it when the template changed it too", () => {
    const ours = { scripts: { lint: "oxlint", test: "vitest run --silent" }, type: "module" };
    const theirs = { scripts: { lint: "oxlint", test: "vitest run --coverage" }, type: "module" };

    expect(mergeValues(ours, base, theirs, "json")).toEqual({
      conflicts: ["scripts.test"],
      value: ours,
    });
  });

  test("removes a key the template dropped unless the repository changed it", () => {
    const theirs = { scripts: {}, type: "module" };

    expect(mergeValues(base, base, theirs, "json").value).toEqual({ scripts: {}, type: "module" });
    expect(
      mergeValues({ ...base, scripts: { lint: "eslint .", test: "vitest run" } }, base, theirs, "json").value,
    ).toEqual({ scripts: { lint: "eslint ." }, type: "module" });
  });

  test("adds keys the template introduced", () => {
    expect(mergeValues({ type: "module" }, { type: "module" }, { sideEffects: false, type: "module" }, "json").value).toEqual({
      sideEffects: false,
      type: "module",
    });
  });

  test("keeps the repository's value for a key the base doesn't know in YAML", () => {
    expect(mergeValues({ linkWorkspacePackages: true }, {}, { linkWorkspacePackages: false }, "yaml").value).toEqual({
      linkWorkspacePackages: true,
    });
  });

  test("merges lists as a union and drops items the template removed", () => {
    const merged = mergeValues(
      { packages: ["docs", "packages/*", "playground"] },
      { packages: ["docs", "packages/*"] },
      { packages: ["packages/*", "examples/*"] },
      "yaml",
    );

    expect(merged.value).toEqual({ packages: ["packages/*", "playground", "examples/*"] });
  });
});
