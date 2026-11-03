---
"template-files": minor
---

Adds a `supply-chain` job to the CI workflow that installs the dependencies through [Socket Firewall](https://github.com/SocketDev/sfw-free) on each pull request and push, so a dependency update that pulls in a malicious package fails before it can be merged.
