---
"template-files": minor
---

Adds a `labels.json` that defines the labels of every repository and a `Sync labels` workflow that applies it each Monday and after every change. GitHub's default labels like `bug` are renamed to their emoji versions so issues keep them, and unused labels that are not listed are deleted.

The `labeler.yaml` template no longer deletes and recreates the labels on every pull request.
