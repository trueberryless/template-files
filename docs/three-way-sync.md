# Three-way sync

Today a `copy` operation overwrites whatever a repository changed in a synced file, and `merge-json`, `merge-yaml` and `add-missing-lines` only keep additions. If I adjust a synced file in one repository, the next sync either throws the change away or I have to `skip` the whole file. This document describes how the sync can tell a local change apart from an outdated file, so local changes made after a sync win and template changes still arrive.

## Idea

For every synced file there are three versions:

- **base**: the template as it was rendered at the last sync of this repository
- **ours**: the file in the repository now
- **theirs**: the template as it is rendered now

This is the same model [Copier](https://copier.readthedocs.io/) uses for `copier update`: it records the template commit a project was generated from and does a three-way merge against it.

## Lock file

Each synced repository gets a small `.github/template-files.json` written by the sync:

```json
{
  "commit": "9de0226…",
  "files": {
    ".github/workflows/ci.yaml": "sha256-…"
  }
}
```

`commit` is the template-files commit of the last sync, so the base can be rendered again with `git show <commit>:templates/<source>` and the repository's props. The hashes are only a shortcut: when the hash of ours equals the hash of base, nothing changed locally and no merge is needed.

## Per file

1. ours equals base: there is no local change, so write theirs (what `copy` does today).
2. theirs equals base: the template did not change, so keep ours.
3. Both changed: run `git merge-file -p ours base theirs`.
   - A clean merge is written to the file.
   - On a conflict the file stays as ours, and the pull request body lists it with the template diff in a `<details>` block, so I can apply it by hand. Conflict markers never end up in a commit, because CI would fail on them.

For `merge-json` and `merge-yaml` the same rules apply per key path instead of per line: a key the template changed since base is updated unless ours changed that same key too.

Generated files like the trimmed `ci.yaml` are compared after trimming, so a repository without tests does not look like it deleted the test job.

## First sync with a lock file

Repositories that were synced before have no lock file. For them the base is the template at the last release tag, because that is what their last sync PR contained. Every later sync writes the lock file in the same pull request.

## Opting out

`skip` stays for files a repository owns completely. A new `strategy` per target in `repositories.json` (`"overwrite"`, `"three-way"`) allows forcing today's behavior for a file, for example a `LICENSE`.

## Later: other forges

The planning step (render, compare, merge) only needs file contents and the lock file, so it can stay free of GitHub. Cloning, pushing and opening the pull request would move behind a small forge interface with GitHub as the first implementation. Before writing that interface myself, I want to check the `forges` npm package and how Bingo handles its transitions, since both might cover parts of it.

## Steps

1. Write the lock file on every sync, without changing any merge behavior yet.
2. Add the three-way merge for `copy` targets and list conflicts in the pull request body.
3. Move `merge-json` and `merge-yaml` to per-key three-way merges.
4. Onboard the repositories with custom workflows (`opendeck.space`, `pronouns.blue`, `astro-docs-i18n-reviewer`), which only works well after step 2.
