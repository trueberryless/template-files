import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

import {
  type ExistingLabel,
  getRepositoryLabels,
  parseLabelConfig,
  planLabelChanges,
} from "./labels.ts";

const BUG = {
  aliases: ["bug"],
  color: "D73A4A",
  description: "Something isn't working",
  name: "🐛 bug",
};

function existing(
  name: string,
  overrides: Partial<ExistingLabel> = {}
): ExistingLabel {
  return {
    color: "D73A4A",
    description: "Something isn't working",
    name,
    ...overrides,
  };
}

describe("parseLabelConfig", () => {
  test("parses the labels.json of this repository", () => {
    const config = parseLabelConfig(
      JSON.parse(
        readFileSync(resolve(import.meta.dirname, "../labels.json"), "utf8")
      )
    );

    expect(config.labels.length).toBeGreaterThan(0);
  });

  test("normalizes colors to upper case", () => {
    const config = parseLabelConfig({
      labels: [{ color: "d73a4a", name: "🐛 bug" }],
    });

    expect(config.labels[0]?.color).toBe("D73A4A");
  });

  test("throws when a name or alias is defined twice for a repository", () => {
    expect(() =>
      parseLabelConfig({
        labels: [BUG],
        repositories: { "owner/repo": [{ color: "FFFFFF", name: "Bug" }] },
      })
    ).toThrow(/'Bug' is defined more than once for 'owner\/repo'/);
  });
});

describe("getRepositoryLabels", () => {
  test("adds the labels of a single repository to the shared ones", () => {
    const config = parseLabelConfig({
      labels: [BUG],
      repositories: { "owner/repo": [{ color: "0E8A16", name: "📚 content" }] },
    });

    expect(getRepositoryLabels(config, "owner/repo").map(({ name }) => name)).toEqual([
      "🐛 bug",
      "📚 content",
    ]);
    expect(getRepositoryLabels(config, "owner/other").map(({ name }) => name)).toEqual([
      "🐛 bug",
    ]);
  });
});

describe("planLabelChanges", () => {
  const wanted = parseLabelConfig({ labels: [BUG] }).labels;
  const unused = () => false;

  test("creates a missing label", () => {
    expect(planLabelChanges([], wanted, unused)).toEqual([
      { label: wanted[0], type: "create" },
    ]);
  });

  test("leaves an up-to-date label alone", () => {
    expect(planLabelChanges([existing("🐛 bug")], wanted, unused)).toEqual([]);
  });

  test("updates the color and description of an existing label", () => {
    expect(
      planLabelChanges(
        [existing("🐛 bug", { color: "ededed", description: null })],
        wanted,
        unused
      )
    ).toEqual([{ label: wanted[0], name: "🐛 bug", type: "update" }]);
  });

  test("renames an alias so its issues keep the label", () => {
    expect(planLabelChanges([existing("bug")], wanted, unused)).toEqual([
      { from: "bug", label: wanted[0], type: "rename" },
    ]);
  });

  test("merges an alias into the label when both exist", () => {
    expect(
      planLabelChanges([existing("🐛 bug"), existing("Bug")], wanted, unused)
    ).toEqual([{ from: "Bug", into: "🐛 bug", type: "merge" }]);
  });

  test("deletes unknown labels only when nothing uses them", () => {
    expect(
      planLabelChanges(
        [existing("🐛 bug"), existing("stale"), existing("translation")],
        wanted,
        (name) => name === "translation"
      )
    ).toEqual([
      { name: "stale", type: "delete" },
      { name: "translation", type: "keep" },
    ]);
  });
});
