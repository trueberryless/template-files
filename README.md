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
| `ci`            | `false`                          | Also sync the CI workflow, oxlint config and test tooling  |
| `skip`          | `[]`                             | Template targets or sources to leave alone, e.g. `.prettierrc` |
| `formatter`     | `prettier`                       | `oxfmt` syncs the oxfmt config, workflow and scripts instead of Prettier's |

Templates use `<%= property %>` placeholders. Besides the properties above, `owner`, `repositoryName`, `repositoryUrl`, `packageDirectory` and `branchName` are available, so moving a repository to another account only requires changing its `name`.

Files are synced in one of these ways:

- **copy**: the file is replaced.
- **merge-json**: the template is deep-merged into the existing file, its values win (`package.json`).
- **merge-yaml**: the template provides defaults, existing values win and lists are unioned (`pnpm-workspace.yaml`).
- **add-missing-lines**: missing patterns are appended, existing lines are kept (`.gitignore`, `.prettierignore`).
- **replace-license**: only the `## License` section of a README is replaced.
- **delete**: obsolete files are removed.

## Workflows

| Workflow                                                           | Trigger                                                   | What it does                                                                                                                                                              |
| ------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Update Template Files Across Repos](./.github/workflows/sync.yaml) | a release commit on `main`, or by hand                    | Syncs every repository, writes a report and publishes a GitHub release that links to the two workflows below                                                             |
| [Sync one repository](./.github/workflows/sync-repository.yaml)    | by hand, with the repository (`owner/name`)               | Syncs a single repository again, for example after a merge conflict. The pull request is recreated from the current default branch                                    |
| [Merge sync pull requests](./.github/workflows/merge-sync-prs.yaml) | by hand, optionally as a dry run and with a merge method | Merges every open sync pull request that is mergeable and has no failing or running checks, and lists why the others were skipped                                       |

## Commands

```shell
pnpm check   # typecheck the sync scripts
pnpm test    # unit tests
pnpm sync    # sync one repository, needs GH_TOKEN and REPOSITORY (owner/name)
pnpm merge   # merge the open sync pull requests, needs GH_TOKEN; OWNER, DRY_RUN=true and MERGE_METHOD are optional
```

## Project structure

```
.
├── .changeset
│   ├── README.md
│   ├── config.json
│   ├── remove-discord.md
│   ├── stop-skipping-deploys.md
│   ├── sync-more-sites.md
│   ├── sync-starlight-compass.md
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
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── repositories.json
├── sync
│   ├── config.test.ts
│   ├── config.ts
│   ├── content.test.ts
│   ├── content.ts
│   ├── git.test.ts
│   ├── git.ts
│   ├── index.ts
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
