---
"template-files": minor
---

Adds `trustPolicy: no-downgrade` and `trustPolicyIgnoreAfter: 43200` to the synced `pnpm-workspace.yaml`. pnpm then refuses to install a version published in the last 30 days with weaker trust evidence than an earlier version, for example without trusted publishing after the package used it before.
