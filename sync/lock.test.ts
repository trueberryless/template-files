import { describe, expect, test } from "vitest";

import {
  createLockFile,
  hashContent,
  parseLockFile,
  serializeLockFile,
} from "./lock.ts";

describe("hashContent", () => {
  test("prefixes a base64 SHA-256 hash", () => {
    expect(hashContent("hello\n")).toBe(
      "sha256-WJG1tSLV3whtD/CxEPvZ0hu0/HFjrzTQgoai6Eb2vgM="
    );
  });
});

describe("createLockFile", () => {
  test("records the commit and sorts the files by path", () => {
    const lockFile = createLockFile("abc123", [
      ["package.json", "{}\n"],
      [".github/workflows/ci.yaml", "name: CI\n"],
    ]);

    expect(Object.keys(lockFile.files)).toEqual([
      ".github/workflows/ci.yaml",
      "package.json",
    ]);
    expect(lockFile).toMatchObject({
      commit: "abc123",
      files: { "package.json": hashContent("{}\n") },
    });
  });
});

describe("parseLockFile", () => {
  test("reads back a serialized lock file", () => {
    const lockFile = createLockFile("abc123", [["LICENSE", "MIT\n"]]);

    expect(parseLockFile(serializeLockFile(lockFile))).toEqual(lockFile);
  });

  test.each(["", "{}", '{ "commit": "abc", "files": { "LICENSE": "md5-x" } }'])(
    "returns undefined for an invalid lock file: %s",
    (text) => {
      expect(parseLockFile(text)).toBeUndefined();
    }
  );
});
