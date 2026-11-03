import { createHash } from "node:crypto";
import { z } from "zod";

/** Where every synced repository keeps what its last sync wrote. */
export const LOCK_FILE = ".github/template-files.json";

const LockFileSchema = z.object({
  commit: z.string().min(1),
  files: z.record(z.string(), z.string().startsWith("sha256-")),
});

export type LockFile = z.output<typeof LockFileSchema>;

export function hashContent(content: string) {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}

/**
 * Creates the lock file for a sync: the template-files commit it ran on and a hash of every synced file as the sync
 * left it, which is the base a later sync compares the repository's file against.
 */
export function createLockFile(
  commit: string,
  files: Iterable<[target: string, content: string]>
): LockFile {
  const hashes: Record<string, string> = {};

  for (const [target, content] of [...files].toSorted(([a], [b]) =>
    a.localeCompare(b)
  )) {
    hashes[target] = hashContent(content);
  }

  return { commit, files: hashes };
}

export function serializeLockFile(lockFile: LockFile) {
  return `${JSON.stringify(lockFile, null, 2)}\n`;
}

export function parseLockFile(text: string): LockFile | undefined {
  try {
    return LockFileSchema.parse(JSON.parse(text));
  } catch {
    return undefined;
  }
}
