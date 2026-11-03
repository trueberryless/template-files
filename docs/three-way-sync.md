# Three-way sync

When you adjust a synced file in one repository, for example a workflow that needs an extra step, the next sync shouldn't throw that change away. The three-way sync prevents that by remembering what the template looked like at each repository's last sync. With that, the sync tells a change you made on purpose apart from a file that is simply outdated, so it keeps your change and still brings in the template's.

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
2. If the lock file has no entry for the file, for example because the repository has no lock file at all, the sync can't tell your change apart from an outdated file, so it writes the template.
3. If your file still matches the hash in the lock file, you haven't changed it, so the template's new version replaces it.
4. If you changed the file but the template didn't change since the last sync, your version stays as it is.
5. If both changed, the sync merges the two with `git merge-file`. When the changes are on different lines, the merged file is written. When they touch the same lines, your version stays.

Whenever your version stays because of a conflict, the sync pull request has a "Not applied" section with the template's changes as a diff, so you can apply them by hand. Conflict markers never end up in a commit, because the repository's CI would fail on them. The same happens when the base can't be rendered, for example because the template at the recorded commit uses a property the repository doesn't have.

## What happens to package.json and pnpm-workspace.yaml

The template for a JSON or YAML file only sets some of its keys, so these files are merged key by key instead of line by line. For every key the template sets, the sync compares your value with the base:

- If you left the key as it was at the last sync, it gets the template's new value. A key the template no longer sets is removed, as long as you didn't change it.
- If you changed the key and the template changed it too, your value stays and the pull request lists the key under "Not applied".
- A key the template sets but the base doesn't know follows the file's usual rule: in `package.json` the template's value wins, and in `pnpm-workspace.yaml` your value wins.

Lists in `pnpm-workspace.yaml`, like `packages`, are merged as a set, so your own entries stay and the ones the template drops are removed. Keys the template never sets, like `name` or your own scripts, are never touched. Without a base, for example in a repository that has no lock file, both files are merged the way the [file types](../README.md#how-it-works) in the README describe.

## Limits and open work

A CI workflow that the sync trims to a repository's scripts isn't merged this way. It should be, by comparing the trimmed versions with each other, because comparing them with the full template would make a repository without tests look like it deleted the test job.

Once the CI workflow is merged too, repositories with workflows of their own, like `opendeck.space`, `pronouns.blue` and `astro-docs-i18n-reviewer`, can join the sync without losing their changes. A `strategy` option per target in `repositories.json` could then force a plain overwrite for files that a repository should never change, like the `LICENSE`.

## Other forges

Rendering, comparing and merging only need file contents and the lock file, so that part doesn't depend on GitHub. Cloning, pushing and opening the pull request could move behind a small forge interface, with GitHub as the first implementation. Before you write that interface, it is worth checking the `forges` npm package and how [Bingo](https://www.create.bingo/) keeps repositories up to date with their templates, since either might already cover part of it.
