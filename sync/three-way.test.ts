import { describe, expect, test } from "vitest";

import { mergeTextFiles } from "./git.ts";
import { hashContent } from "./lock.ts";
import { mergeSyncedFile } from "./three-way.ts";

const BASE = "one\ntwo\nthree\nfour\nfive\n";

function merge(input: { base?: string; locked?: string; ours?: string; theirs: string }) {
  return mergeSyncedFile(
    {
      getBase: () => input.base,
      baseHash: input.locked === undefined ? undefined : hashContent(input.locked),
      ours: input.ours,
      theirs: input.theirs,
    },
    mergeTextFiles
  );
}

describe("mergeSyncedFile", () => {
  test("writes the template when the repository does not have the file", () => {
    expect(merge({ locked: BASE, theirs: BASE })).toEqual({ content: BASE, type: "template" });
  });

  test("writes the template when there is no lock file entry", () => {
    expect(merge({ ours: "local\n", theirs: BASE })).toEqual({ content: BASE, type: "template" });
  });

  test("writes the template when the repository did not change the file", () => {
    const theirs = BASE.replace("five", "FIVE");

    expect(merge({ base: BASE, locked: BASE, ours: BASE, theirs })).toEqual({ content: theirs, type: "template" });
  });

  test("keeps the repository's change when the template did not change", () => {
    const ours = BASE.replace("one", "ONE");

    expect(merge({ base: BASE, locked: BASE, ours, theirs: BASE })).toEqual({ content: ours, type: "kept" });
  });

  test("merges changes to different lines", () => {
    const ours = BASE.replace("one", "ONE");
    const theirs = BASE.replace("five", "FIVE");

    expect(merge({ base: BASE, locked: BASE, ours, theirs })).toEqual({
      content: "ONE\ntwo\nthree\nfour\nFIVE\n",
      type: "merged",
    });
  });

  test("keeps the repository's version on a conflict", () => {
    const ours = BASE.replace("three", "local");
    const theirs = BASE.replace("three", "template");

    expect(merge({ base: BASE, locked: BASE, ours, theirs })).toEqual({ content: ours, type: "conflict" });
  });

  test("reports a conflict when the base can no longer be rendered", () => {
    const ours = BASE.replace("one", "ONE");

    expect(merge({ locked: BASE, ours, theirs: BASE.replace("five", "FIVE") })).toEqual({
      content: ours,
      type: "conflict",
    });
  });
});
