# `template-files`

Provide single point of truth for template files.

## How it works

Every repository listed in [`repositories.json`](./repositories.json) receives the files of its **preset** from [`templates/`](./templates). The sync opens (or updates) one `update-template-files` pull request per repository.

| Preset      | For                                                                  |
| ----------- | -------------------------------------------------------------------- |
| `site`      | A single package at the repository root                              |
| `plugin`    | A pnpm workspace with `docs/` and `packages/<package>/` and changesets |
| `tooling`   | Internal tooling repositories like this one                          |

A repository entry only needs `name` and `preset`. Everything else is optional:

| Property        | Default                          | Meaning                                                    |
| --------------- | -------------------------------- | ---------------------------------------------------------- |
| `package`       | the repository name              | npm package name, may be scoped                            |
| `homepage`      | `https://<repository>.netlify.app/` | `homepage` in every synced `package.json`               |
| `branch`        | `main`                           | Default branch                                             |
| `ci` | `false` | Also add the oxlint config and the `lint`, `knip`, `format` and test scripts, with oxlint, knip, Vitest and Playwright as dev dependencies |
| `skip`          | `[]`                             | Template targets or sources to leave alone, e.g. `.prettierrc` |
| `formatter`     | `prettier`                       | `oxfmt` syncs the oxfmt config, workflow and scripts instead of Prettier's |

Templates use `<%= property %>` placeholders. Besides the properties above, `owner`, `repositoryName`, `repositoryUrl`, `packageDirectory` and `branchName` are available, so moving a repository to another account only requires changing its `name`.

Every repository also gets the CI workflow from [`ci.yaml`](./templates/.github/workflows/ci.yaml), trimmed to what the repository can actually run. Steps that call a `package.json` script the repository doesn't have are left out, and a job with nothing left to run is removed. The end-to-end job only stays when there is a Playwright config, and the test job runs `pnpm test` when there is no `test:coverage` script. The Socket Firewall job always stays, so every pull request installs its dependencies through the firewall. Because the workflow is trimmed after all other files are synced, the scripts that the `ci` option adds already count.

Each sync also writes `.github/template-files.json` into the repository. It records the template-files commit the sync ran on and, for every synced file, a hash of what the template produced. The next sync uses it for **copy** targets to tell your own changes apart from an outdated file: a file you changed since the last sync stays as it is, and if the template changed too, the two changes are merged. When they touch the same lines, your version stays and the pull request lists the template's changes under "Not applied", so you can apply them by hand. In a repository without the lock file, copied files are overwritten, and the [three-way sync](./docs/three-way-sync.md) document explains the details.

Files are synced in one of these ways:

- **copy**: the file is replaced, unless the repository changed it since the last sync (see above).
- **merge-json**: the template is deep-merged into the existing file and its values win (`package.json`). With a lock file, keys you changed since the last sync stay, see the [three-way sync](./docs/three-way-sync.md).
- **merge-yaml**: the template provides defaults, existing values win and lists are unioned (`pnpm-workspace.yaml`). With a lock file, values the template changed reach keys you left as they were.
- **add-missing-lines**: missing patterns are appended, existing lines are kept (`.gitignore`, `.prettierignore`).
- **replace-license**: only the `## License` section of a README is replaced.
- **delete**: obsolete files are removed.

## Workflows

| Workflow                                                           | Trigger                                                   | What it does                                                                                                                                                              |
| ------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Update Template Files Across Repos](./.github/workflows/sync.yaml) | a release commit on `main`, or by hand                    | Syncs every repository, writes a report and publishes a GitHub release that links to the two workflows below                                                             |
| [Sync one repository](./.github/workflows/sync-repository.yaml)    | by hand, with the repository (`owner/name`)               | Syncs a single repository again, for example after a merge conflict. The pull request is recreated from the current default branch                                    |
| [Merge sync pull requests](./.github/workflows/merge-sync-prs.yaml) | by hand, optionally as a dry run and with a merge method | Merges every open sync pull request that is mergeable and has no failing or running checks, and lists why the others were skipped                                       |
| [Sync labels](./.github/workflows/sync-labels.yaml) | a change to `labels.json` on `main`, every Monday, or by hand | Applies `labels.json` to every repository of the owner that is neither archived nor a fork. See [Labels](#labels) |

## Labels

Labels are kept in sync too, and for more repositories than the files. [`labels.json`](./labels.json) defines the labels of every repository of the owner that is neither archived nor a fork, whether it is listed in `repositories.json` or not. The labels under `labels` go to all of them, and `repositories` adds labels that only a single repository needs, like the translation labels of `opendeck.space`.

The [Sync labels](./.github/workflows/sync-labels.yaml) workflow applies the file every Monday, after every change to it on `main`, and whenever you start it by hand. In each repository it creates the missing labels and updates the color and description of the existing ones. A label listed under `aliases`, such as GitHub's default `bug`, is renamed instead of being recreated, so your issues and pull requests keep it. If the alias and the new label both exist, the issues move over to the new label and the alias is deleted.

Every other label is deleted only when no issue or pull request uses it. The ones that are still in use stay and show up in the job summary, so you can decide whether to add them to `labels.json` or remove them by hand. Before you change `labels.json`, start the workflow with the dry-run option to see what it would do, or run `DRY_RUN=true pnpm labels` locally, which prints the same report with your own `gh` login.

## Commands

```shell
pnpm check   # typecheck the sync scripts
pnpm test    # unit tests
pnpm sync    # sync one repository, needs GH_TOKEN and REPOSITORY (owner/name)
pnpm labels  # sync the labels of every repository, needs GH_TOKEN or a gh login; OWNER, REPOSITORY and DRY_RUN=true are optional
pnpm merge   # merge the open sync pull requests, needs GH_TOKEN; OWNER, DRY_RUN=true and MERGE_METHOD are optional
```

## Project structure

```
.
├── .changeset
│   ├── README.md
│   ├── ci-for-every-repo.md
│   ├── config.json
│   ├── label-sync.md
│   ├── remove-discord.md
│   ├── socket-firewall.md
│   ├── stop-skipping-deploys.md
│   ├── sync-lock-file.md
│   ├── sync-more-sites.md
│   ├── sync-starlight-compass.md
│   ├── sync-starter-sites.md
│   ├── three-way-copy.md
│   ├── three-way-json-yaml.md
│   └── time-tracker-oxfmt.md
├── .github
│   ├── labeler.yaml
│   ├── readmetreerc.yaml
│   ├── renovate.json
│   └── workflows
│       ├── ci.yaml
│       ├── format.yaml
│       ├── generate-readme-tree.yaml
│       ├── labeler.yaml
│       ├── merge-sync-prs.yaml
│       ├── sync-labels.yaml
│       ├── sync-repository.yaml
│       ├── sync.yaml
│       └── welcome-bot.yaml
├── .gitignore
├── .oxlintrc.json
├── .prettierignore
├── .prettierrc
├── CHANGELOG.md
├── LICENSE
├── README.md
├── docs
│   └── three-way-sync.md
├── labels.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── repositories.json
├── sync
│   ├── ci.test.ts
│   ├── ci.ts
│   ├── config.test.ts
│   ├── config.ts
│   ├── content.test.ts
│   ├── content.ts
│   ├── git-text.test.ts
│   ├── git.test.ts
│   ├── git.ts
│   ├── index.ts
│   ├── labels-all.ts
│   ├── labels.test.ts
│   ├── labels.ts
│   ├── lock.test.ts
│   ├── lock.ts
│   ├── merge-all.ts
│   ├── merge.test.ts
│   ├── merge.ts
│   ├── operations.ts
│   ├── presets.test.ts
│   ├── presets.ts
│   ├── props.ts
│   ├── pull-request.ts
│   ├── report.ts
│   ├── repository.ts
│   ├── shell.ts
│   ├── summary.test.ts
│   ├── summary.ts
│   ├── three-way-values.test.ts
│   ├── three-way-values.ts
│   ├── three-way.test.ts
│   ├── three-way.ts
│   └── types.ts
├── templates
│   ├── .changeset
│   │   ├── README.md
│   │   └── config.json
│   ├── .github
│   │   ├── FUNDING.yaml
│   │   ├── labeler.yaml
│   │   ├── renovate.json
│   │   └── workflows
│   │       ├── ci.yaml
│   │       ├── format.oxfmt.yaml
│   │       ├── format.yaml
│   │       ├── labeler.yaml
│   │       ├── publish.yaml
│   │       └── welcome-bot.yaml
│   ├── .gitignore
│   │   └── Node.gitignore
│   ├── .oxlintrc.json
│   ├── .prettierignore
│   ├── .prettierrc
│   │   └── .prettierrc
│   ├── LICENSE
│   ├── README.md
│   ├── oxfmt
│   │   └── .oxfmtrc.json
│   ├── package.json
│   │   ├── changeset.package.json
│   │   ├── definition.package.json
│   │   ├── oxfmt.package.json
│   │   ├── package.manager.package.json
│   │   ├── prettier.package.json
│   │   ├── testing.oxfmt.package.json
│   │   └── testing.package.json
│   └── pnpm-workspace
│       ├── plugin.yaml
│       └── site.yaml
└── tsconfig.json

```

## License

Licensed under the MIT license, Copyright © trueberryless.

See [LICENSE](https://github.com/trueberryless/template-files/blob/main/LICENSE) for more information.
