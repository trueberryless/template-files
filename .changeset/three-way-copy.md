---
"template-files": minor
---

Keeps changes made in a repository to a copied file. If only the repository changed the file since its last sync, the sync leaves it alone. If the template changed too, both changes are merged, and if they conflict the repository's version stays and the sync pull request shows the template changes under "Not applied".
