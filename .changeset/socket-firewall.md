---
"template-files": minor
---

Adds a Socket Firewall job that installs the dependencies through [Socket Firewall](https://github.com/SocketDev/sfw-free) on each pull request and push, so a dependency update that pulls in a malicious package fails before it can be merged. Repositories with the `ci` option get it as a `supply-chain` job in `ci.yaml`, all others as a `supply-chain.yaml` workflow.
