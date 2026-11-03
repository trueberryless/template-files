import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";

import { BOT_IDENTITY, diffTexts, readFileAtCommit } from "./git.ts";
import { run } from "./shell.ts";

const directories: string[] = [];

afterEach(() => {
  for (const directory of directories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

function commitFile(directory: string, content: string) {
  writeFileSync(join(directory, "file.txt"), content);
  run("git", ["add", "file.txt"], directory);
  run("git", ["commit", "--message", "update"], directory, BOT_IDENTITY);

  return run("git", ["rev-parse", "HEAD"], directory);
}

describe("readFileAtCommit", () => {
  test("reads a file as it was at an earlier commit", () => {
    const directory = mkdtempSync(join(tmpdir(), "read-at-commit-"));
    directories.push(directory);
    run("git", ["init", "--quiet"], directory);

    const first = commitFile(directory, "first\n");
    commitFile(directory, "second\n");

    expect(readFileAtCommit(directory, first, "file.txt")).toBe("first\n");
    expect(readFileAtCommit(directory, first, "missing.txt")).toBeUndefined();
  });
});

describe("diffTexts", () => {
  test("labels the diff with the file's path", () => {
    expect(diffTexts("one\ntwo\n", "one\nTWO\n", ".prettierrc")).toBe(
      [
        "--- a/.prettierrc",
        "+++ b/.prettierrc",
        "@@ -1,2 +1,2 @@",
        " one",
        "-two",
        "+TWO",
      ].join("\n")
    );
  });
});
