import { hashContent } from "./lock.ts";

export type MergeResult =
  | { content: string; type: "template" }
  | { content: string; type: "kept" }
  | { content: string; type: "merged" }
  | { content: string; type: "conflict" };

export interface MergeInput {
  /** Renders the template as it was at the last sync, or `undefined` when that is no longer possible. */
  getBase: () => string | undefined;
  /** The hash the lock file recorded for this target at the last sync. */
  baseHash: string | undefined;
  /** The file in the repository now. */
  ours: string | undefined;
  /** The template as it is rendered now. */
  theirs: string;
}

/**
 * Decides what a synced file becomes. The template wins when the repository did not change the file since the last
 * sync, the repository's version wins when only it changed, and when both changed the two are merged line by line.
 * A merge with conflicts keeps the repository's version, so conflict markers never end up in a commit.
 */
export function mergeSyncedFile(
  { baseHash, getBase, ours, theirs }: MergeInput,
  mergeText: (ours: string, base: string, theirs: string) => TextMerge
): MergeResult {
  if (ours === undefined || ours === theirs) {
    return { content: theirs, type: "template" };
  }

  // Without a lock file entry there is no way to tell a local change from an outdated file.
  if (baseHash === undefined || hashContent(ours) === baseHash) {
    return { content: theirs, type: "template" };
  }

  const base = getBase();

  if (base === undefined) return { content: ours, type: "conflict" };
  if (base === theirs) return { content: ours, type: "kept" };

  const merge = mergeText(ours, base, theirs);

  return merge.isClean
    ? { content: merge.content, type: "merged" }
    : { content: ours, type: "conflict" };
}

export interface TextMerge {
  content: string;
  isClean: boolean;
}
