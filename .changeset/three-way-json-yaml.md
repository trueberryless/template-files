---
"template-files": minor
---

Merges `package.json` and `pnpm-workspace.yaml` key by key against the last sync. A key you left as it was gets the template's new value, a key you changed stays, and a key the template no longer sets is removed unless you changed it. Keys where both sides changed are listed under "Not applied" in the sync pull request.
