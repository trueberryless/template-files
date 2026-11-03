import { isDeepStrictEqual } from "node:util";

/** `json` lets the template win where there is no base and replaces lists, `yaml` keeps the repository's value and unions lists. */
export type FileKind = "json" | "yaml";

export interface ValueMerge {
  /** Key paths, like `scripts.test`, where the repository's value stayed although the template changed it. */
  conflicts: string[];
  value: unknown;
}

/**
 * Merges a template fragment into a structured file key by key. A key the template changed since the base gets the
 * template's value unless the repository changed that key too, a key the template removed is removed when the
 * repository left it as it was, and keys the template never set stay untouched.
 */
export function mergeValues(
  ours: unknown,
  base: unknown,
  theirs: unknown,
  kind: FileKind
): ValueMerge {
  const conflicts: string[] = [];
  const value = mergeAt(ours, base, theirs, kind, [], conflicts);

  return { conflicts, value };
}

function mergeAt(
  ours: unknown,
  base: unknown,
  theirs: unknown,
  kind: FileKind,
  path: string[],
  conflicts: string[]
): unknown {
  if (isRecord(ours) && isRecord(theirs)) {
    const result: Record<string, unknown> = { ...ours };
    const baseRecord = isRecord(base) ? base : {};

    for (const key of new Set([
      ...Object.keys(baseRecord),
      ...Object.keys(theirs),
    ])) {
      if (!(key in theirs)) {
        if (isDeepStrictEqual(ours[key], baseRecord[key])) delete result[key];
        continue;
      }

      result[key] = mergeAt(
        ours[key],
        baseRecord[key],
        theirs[key],
        kind,
        [...path, key],
        conflicts
      );
    }

    return result;
  }

  if (kind === "yaml" && Array.isArray(ours) && Array.isArray(theirs)) {
    const removed = Array.isArray(base)
      ? base.filter((item) => !theirs.some((t) => isDeepStrictEqual(t, item)))
      : [];
    const kept = ours.filter(
      (item) => !removed.some((r) => isDeepStrictEqual(r, item))
    );

    return [
      ...kept,
      ...theirs.filter((item) => !kept.some((k) => isDeepStrictEqual(k, item))),
    ];
  }

  if (ours === undefined || isDeepStrictEqual(ours, base)) return theirs;

  // A key the template didn't set at the last sync follows the file's usual rule.
  if (base === undefined) return kind === "json" ? theirs : ours;

  if (!isDeepStrictEqual(theirs, base) && !isDeepStrictEqual(theirs, ours))
    conflicts.push(path.join("."));

  return ours;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
