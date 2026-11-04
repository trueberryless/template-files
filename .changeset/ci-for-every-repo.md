---
"template-files": minor
---

Adds the CI workflow to every repository, trimmed to what the repository can run: steps whose `package.json` script is missing are left out, the end-to-end job only runs with a Playwright config, and the test job runs `pnpm test` when there is no `test:coverage` script. A repository without any of the scripts gets no workflow. The `ci` option now only adds the oxlint config and the test tooling.
