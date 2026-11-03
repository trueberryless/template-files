# Three-way sync

The sync used to treat every repository as if nobody had touched its synced files. A `copy` operation overwrote the file, and the JSON merge put the template's values back over yours. So if you adjusted a synced workflow in one repository, the next sync either threw that change away or you had to `skip` the whole file. The three-way sync fixes this by remembering what the template looked like at each repository's last sync. With that, the sync can tell a change you made on purpose apart from a file that is simply outdated, and keep your change while still bringing in the template's.

## Three versions of a file

For every synced file, the sync looks at three versions:

- the **base**, which is the template as it was rendered at the repository's last sync,
- **ours**, which is the file in the repository now,
- **theirs**, which is the template as it is rendered now.

Comparing ours with the base shows what changed in the repository, and comparing theirs with the base shows what changed in the template. This is the same idea [Copier](https://copier.readthedocs.io/) uses for `copier update`, where a project records the template commit it was generated from and later updates merge against it.

## The lock file

To know the base, every synced repository keeps a lock file at `.github/template-files.json`, which the sync writes itself:

```json
{
  "commit": "b9a5cca…",
  "files": {
    ".github/workflows/format.yaml": "sha256-…",
    "LICENSE": "sha256-…"
  }
}
```

`commit` is the template-files commit of the last sync. Because each template can be read back at that commit with `git show <commit>:templates/<source>` and rendered with the repository's properties, the base doesn't need to be stored in the repository. The hashes are a shortcut: each one is the hash of what the template produced for that file, so if your file still has the same hash, you haven't changed it and no merge is needed.

The sync rewrites the lock file only when it changes something else in the repository, when the lock file is missing, or when it has to report a conflict. Otherwise every new template-files commit would open a pull request in every repository just to update the commit.

## What happens to a copied file

For a `copy` target, the sync goes through these cases in order:

1. If the repository doesn't have the file yet, or it already matches the template, the sync writes the template.
2. If the lock file has no entry for the file, the sync can't tell your change apart from an outdated file, so it writes the template as it always did. This is what happens in a repository's first sync after the lock file was introduced.
3. If your file still matches the hash in the lock file, you haven't changed it, so the template's new version replaces it.
4. If you changed the file but the template didn't change since the last sync, your version stays as it is.
5. If both changed, the sync merges the two with `git merge-file`. When the changes are on different lines, the merged file is written. When they touch the same lines, your version stays.

Whenever your version stays because of a conflict, the sync pull request has a "Not applied" section with the template's changes as a diff, so you can apply them by hand. Conflict markers never end up in a commit, because the repository's CI would fail on them. The same happens when the base can't be rendered anymore, for example because an older template uses a property the repository no longer has.

## What is not covered yet

Only `copy` targets are merged this way so far. The JSON and YAML merges for `package.json` and `pnpm-workspace.yaml` don't look at the lock file yet. They should work per key, so that a value the template changed since the base is updated unless you changed the same key in the repository.

The generated CI workflow, which the sync trims to each repository's scripts, should go through the merge as well. It needs to compare the trimmed versions, because otherwise a repository without tests would look like it deleted the test job.

Once that works, repositories with workflows of their own, like `opendeck.space`, `pronouns.blue` and `astro-docs-i18n-reviewer`, can join the sync without losing their changes. A `strategy` option per target in `repositories.json` could then force the old overwrite for files that a repository should never change, like the `LICENSE`.

## Other forges

Rendering, comparing and merging only need file contents and the lock file, so that part doesn't depend on GitHub. Cloning, pushing and opening the pull request could move behind a small forge interface, with GitHub as the first implementation. Before you write that interface, it is worth checking the `forges` npm package and how [Bingo](https://www.create.bingo/) keeps repositories up to date with their templates, since either might already cover part of it.
