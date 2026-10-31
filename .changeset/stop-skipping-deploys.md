---
"template-files": minor
---

Removes `[skip netlify]` from the release pull request titles and `[skip ci]` from the sync pull request title. When such a pull request was squash-merged, the marker ended up in the commit on `main`, which skipped the production deploy and the CI run there.
