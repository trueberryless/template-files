# template-files

## 0.18.2

### Patch Changes

- [`3bf64af`](https://github.com/trueberryless/template-files/commit/3bf64aff27c8a97e4c8f5410f3da1371b4727b9b) Thanks [@trueberryless](https://github.com/trueberryless)! - Rename true-tracker to time-tracker

## 0.18.1

### Patch Changes

- [`6751f9a`](https://github.com/trueberryless/template-files/commit/6751f9a0c02cac2200f8c4f1d6ef68cc39c5f309) Thanks [@trueberryless](https://github.com/trueberryless)! - Rename all trueberryless-org to trueberryless

## 0.18.0

### Minor Changes

- [`b398230`](https://github.com/trueberryless/template-files/commit/b398230da95c5a5c5300af8e9a434abaa2aaef89) Thanks [@trueberryless](https://github.com/trueberryless)! - Run actions without custom GitHub app; use GITHUB_TOKEN instead

## 0.17.0

### Minor Changes

- [#363](https://github.com/trueberryless/template-files/pull/363) [`f7b00f9`](https://github.com/trueberryless/template-files/commit/f7b00f9e9b508cfd77cc94904cefaaed7dadec4b) Thanks [@trueberryless-bot](https://github.com/trueberryless-bot)! - Adds a “Merge sync pull requests” workflow that merges every open sync pull request with no conflicts and no failing or running checks (with a dry run option), and a “Sync one repository” workflow to re-run the sync for a single repository, for example after a merge conflict. The release notes link to both workflows.

- [#363](https://github.com/trueberryless/template-files/pull/363) [`f7b00f9`](https://github.com/trueberryless/template-files/commit/f7b00f9e9b508cfd77cc94904cefaaed7dadec4b) Thanks [@trueberryless-bot](https://github.com/trueberryless-bot)! - Replaces the shell-based sync with a typed and tested TypeScript implementation. `repositories.json` now only lists a preset and a few properties per repository instead of every file, the `owner` is a template property so repositories can move to another account, and there is a new `ci` option that syncs a CI workflow with lint, format, typecheck, unit, coverage and Playwright end-to-end jobs. The repository list follows the renamed repositories (`releases`, `gh-activity`, `starlight-group-pages`) and no longer contains the archived `npmx-digest`.

## 0.16.3

### Patch Changes

- [`ca33a81`](https://github.com/trueberryless/template-files/commit/ca33a81337e1afa98f9ffa5df2f9c42f67676917) Thanks [@trueberryless](https://github.com/trueberryless)! - Delete leftovers of readmetree synchronisation

## 0.16.2

### Patch Changes

- [`e6cee7b`](https://github.com/trueberryless/template-files/commit/e6cee7b5c9b2c8d30a6b4785f9c8279c0287d251) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove unnecessary Changeset config

## 0.16.1

### Patch Changes

- [`337d4ae`](https://github.com/trueberryless/template-files/commit/337d4ae3f5b5feafa043b92e856b0df7195baee0) Thanks [@trueberryless](https://github.com/trueberryless)! - Update these GitHub actions with major bump: `checkout`, `labeler`, `setup-node`

## 0.16.0

### Minor Changes

- [#338](https://github.com/trueberryless/template-files/pull/338) [`33264c2`](https://github.com/trueberryless/template-files/commit/33264c2a25fb9be1f25203d326ded17d80fa5a51) Thanks [@renovate](https://github.com/apps/renovate)! - Migrate from Changesets v2 to v3

- [`5cf3926`](https://github.com/trueberryless/template-files/commit/5cf39263ddb8294228cdf357af19b1a1f2aeb9d0) Thanks [@trueberryless](https://github.com/trueberryless)! - Migrate to shared Renovate config.

### Patch Changes

- [#351](https://github.com/trueberryless/template-files/pull/351) [`deb8eeb`](https://github.com/trueberryless/template-files/commit/deb8eebe7732b9e8aac782918702aeb2de239276) Thanks [@trueberryless](https://github.com/trueberryless)! - Clean up Docker leafovers completely

- [`cfd0463`](https://github.com/trueberryless/template-files/commit/cfd04638b626f9e77beea09d01d8ee458cadd893) Thanks [@trueberryless](https://github.com/trueberryless)! - Clean up DotNet leftovers completely

- [#352](https://github.com/trueberryless/template-files/pull/352) [`c81e8d2`](https://github.com/trueberryless/template-files/commit/c81e8d24c98db280c870b7ec434d8cbb02ee07e9) Thanks [@trueberryless](https://github.com/trueberryless)! - Clean up manifest files completely

## 0.15.1

### Patch Changes

- [`1de39da`](https://github.com/trueberryless/template-files/commit/1de39dacb926fcb088fe77cde42d0ad691e456cf) Thanks [@trueberryless](https://github.com/trueberryless)! - Add `.netlify` to Node `.gitignore` for all projects.

## 0.15.0

### Minor Changes

- [`e6e02ba`](https://github.com/trueberryless/template-files/commit/e6e02bab748f97b96f26e81646f423880a2a9a38) Thanks [@trueberryless](https://github.com/trueberryless)! - Migrate domain names

## 0.14.1

### Patch Changes

- [`15adfa2`](https://github.com/trueberryless/template-files/commit/15adfa282e4bc1cdb2961300331aec7e4a315fc9) Thanks [@trueberryless](https://github.com/trueberryless)! - Force deletion of tangled.yaml workflow

## 0.14.0

### Minor Changes

- [`fa97f54`](https://github.com/trueberryless/template-files/commit/fa97f54e3eb67504f1a57bbf4588cbea9b33c912) Thanks [@trueberryless](https://github.com/trueberryless)! - Migrate tangled sync to synchub.to

## 0.13.6

### Patch Changes

- [`6f706eb`](https://github.com/trueberryless/template-files/commit/6f706eb9ece51ca9e2fa3b10a516a37c6ce684f9) Thanks [@trueberryless](https://github.com/trueberryless)! - Allow sharp postscripts

## 0.13.5

### Patch Changes

- [`714ff11`](https://github.com/trueberryless/template-files/commit/714ff1117cf8a832b3575cbebf17d40e70306b0f) Thanks [@trueberryless](https://github.com/trueberryless)! - Add renovate automerge after 3 weeks

## 0.13.4

### Patch Changes

- [`4e63420`](https://github.com/trueberryless/template-files/commit/4e63420a711e0e393ede77c8c3da3290a69b98ac) Thanks [@trueberryless](https://github.com/trueberryless)! - Include pnpm workspace file in every repository, since pnpm v11 requires allowBuilds

## 0.13.3

### Patch Changes

- [`f38ec59`](https://github.com/trueberryless/template-files/commit/f38ec594733ec87c73ae07d003c2c8994c03bcf3) Thanks [@trueberryless](https://github.com/trueberryless)! - Allow additional lines in pnpm workspace files per project

- [`74d4bd4`](https://github.com/trueberryless/template-files/commit/74d4bd42a96aef81060395bc2a0c3ace1844ff6a) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix pnpm install command by adding common allowBuilds to pnpm workspace settings

## 0.13.2

### Patch Changes

- [#306](https://github.com/trueberryless/template-files/pull/306) [`6e58f37`](https://github.com/trueberryless/template-files/commit/6e58f378fce1c80c16fa65529c5e083725d9249c) Thanks [@trueberryless](https://github.com/trueberryless)! - Upgrade to pnpm 11

- [#301](https://github.com/trueberryless/template-files/pull/301) [`7cc5e48`](https://github.com/trueberryless/template-files/commit/7cc5e48d8af047f8c72d7ca0d501e4cc22788a68) Thanks [@trueberryless](https://github.com/trueberryless)! - Migrate to official GitHub App Token Action

- [#301](https://github.com/trueberryless/template-files/pull/301) [`7cc5e48`](https://github.com/trueberryless/template-files/commit/7cc5e48d8af047f8c72d7ca0d501e4cc22788a68) Thanks [@trueberryless](https://github.com/trueberryless)! - Use bot token for checkouts

## 0.13.1

### Patch Changes

- [#303](https://github.com/trueberryless/template-files/pull/303) [`75ffa4c`](https://github.com/trueberryless/template-files/commit/75ffa4cfc9455f18d84eaad4fa056ca036db0fe4) Thanks [@trueberryless](https://github.com/trueberryless)! - Limit tangled workflow trigger to main branch and tags.

## 0.13.0

### Minor Changes

- [#296](https://github.com/trueberryless/template-files/pull/296) [`6a1643d`](https://github.com/trueberryless/template-files/commit/6a1643d3df26233c0926c3ce1bbabd688c34962f) Thanks [@trueberryless](https://github.com/trueberryless)! - Add tangle.yaml workflow to sensible repos which mirrors them to tangled.org

### Patch Changes

- [#299](https://github.com/trueberryless/template-files/pull/299) [`27aad53`](https://github.com/trueberryless/template-files/commit/27aad531f300d3f5ca2cd24070123598cc3f70ea) Thanks [@trueberryless](https://github.com/trueberryless)! - Make Node versions consistent

## 0.12.1

### Patch Changes

- [`41d487e`](https://github.com/trueberryless/template-files/commit/41d487ec66402a94667ffff882d385a93ec290aa) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix definition mistakes in repos.json

## 0.12.0

### Minor Changes

- [#289](https://github.com/trueberryless/template-files/pull/289) [`aa2af9d`](https://github.com/trueberryless/template-files/commit/aa2af9df2db3168d5debbfec220f04c538506ef2) Thanks [@trueberryless](https://github.com/trueberryless)! - Add support for package homepages

## 0.11.1

### Patch Changes

- [`21589e7`](https://github.com/trueberryless/template-files/commit/21589e701e2348bb6045532aeec7651017e82388) Thanks [@trueberryless](https://github.com/trueberryless)! - Rename starlight-contributor-list to astro-contributors

## 0.11.0

### Minor Changes

- [#281](https://github.com/trueberryless/template-files/pull/281) [`c4939f7`](https://github.com/trueberryless/template-files/commit/c4939f71bd1064214809e4962df3d0859ce8d41e) Thanks [@trueberryless](https://github.com/trueberryless)! - Make links to LICENSE in README.md absolute.

## 0.10.17

### Patch Changes

- [`6d0d266`](https://github.com/trueberryless/template-files/commit/6d0d2662d453673bf67649f76f7d37ef6488370b) Thanks [@trueberryless](https://github.com/trueberryless)! - Redo labeler changes as they got reverted by sync.

## 0.10.16

### Patch Changes

- [#273](https://github.com/trueberryless/template-files/pull/273) [`094b0a5`](https://github.com/trueberryless/template-files/commit/094b0a5847a2759e91c7a22ad27019e286f86a77) Thanks [@trueberryless](https://github.com/trueberryless)! - Make labeler configuration more robust

## 0.10.15

### Patch Changes

- [`1a5e00f`](https://github.com/trueberryless/template-files/commit/1a5e00f270685234827b6ab3a772727bab10603c) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Rose Pine

## 0.10.14

### Patch Changes

- [#263](https://github.com/trueberryless/template-files/pull/263) [`34677c0`](https://github.com/trueberryless/template-files/commit/34677c0fdcbb16cfe1e2fd57a20a603a3e98e42f) Thanks [@trueberryless](https://github.com/trueberryless)! - Add npmx-digest to repos

- [#263](https://github.com/trueberryless/template-files/pull/263) [`34677c0`](https://github.com/trueberryless/template-files/commit/34677c0fdcbb16cfe1e2fd57a20a603a3e98e42f) Thanks [@trueberryless](https://github.com/trueberryless)! - Add nxjt to repos

## 0.10.13

### Patch Changes

- [#258](https://github.com/trueberryless/template-files/pull/258) [`9dfbe41`](https://github.com/trueberryless/template-files/commit/9dfbe41f80ae71e7598ec2a510d7d1da85b16041) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Recipes repository

## 0.10.12

### Patch Changes

- [`9c730b7`](https://github.com/trueberryless/template-files/commit/9c730b7402224c295544beffe25bf37baf408a79) Thanks [@trueberryless](https://github.com/trueberryless)! - Clean up trueberryless repo

## 0.10.11

### Patch Changes

- [`2a42061`](https://github.com/trueberryless/template-files/commit/2a42061c48e84efd7a19ea748db8d13f26ede1d7) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove release-image-generator changeset sync

- [`ad91b0b`](https://github.com/trueberryless/template-files/commit/ad91b0bab39abb1050b47af42b85f1c9d55042d5) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove src/package.json from trueberryless repo

- [`3b0a329`](https://github.com/trueberryless/template-files/commit/3b0a3294361d818c026ee396fdb55199dd27893e) Thanks [@trueberryless](https://github.com/trueberryless)! - Delete marketing

## 0.10.10

### Patch Changes

- [`03c0c37`](https://github.com/trueberryless/template-files/commit/03c0c37acec29e402b7fb10a11c34c63df1c97ed) Thanks [@trueberryless](https://github.com/trueberryless)! - Manually update prettier-sort plugin

## 0.10.9

### Patch Changes

- [#247](https://github.com/trueberryless/template-files/pull/247) [`e9220e0`](https://github.com/trueberryless/template-files/commit/e9220e0ca40eb351f0f1f14424ceb666b2be2d09) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove assignee when sync PR is created

## 0.10.8

### Patch Changes

- [#240](https://github.com/trueberryless/template-files/pull/240) [`93f904c`](https://github.com/trueberryless/template-files/commit/93f904cade2a68334380525536b07193acf4989a) Thanks [@trueberryless](https://github.com/trueberryless)! - Add explicit empty reviewers and assignees arrays to Renovate config.

## 0.10.7

### Patch Changes

- [`82d6cba`](https://github.com/trueberryless/template-files/commit/82d6cba280c4b738917e304551155cd59b6ff61e) Thanks [@trueberryless](https://github.com/trueberryless)! - Update `releases` repository to new `recent-releases` repository.

## 0.10.6

### Patch Changes

- [`345eb24`](https://github.com/trueberryless/template-files/commit/345eb24ba84edb67e4b0a3dd21276ee41010f5bb) Thanks [@trueberryless](https://github.com/trueberryless)! - Adapt repo config to Release Image Generator Migration to Astro

- [#224](https://github.com/trueberryless/template-files/pull/224) [`b45120f`](https://github.com/trueberryless/template-files/commit/b45120f21d0a8a2119586d5cc10b098e129b5dfe) Thanks [@trueberryless](https://github.com/trueberryless)! - Delete all CODEOWNERS files

## 0.10.5

### Patch Changes

- [`7f09154`](https://github.com/trueberryless/template-files/commit/7f09154e710a6ea85a602cdaf97771609656dc67) Thanks [@trueberryless](https://github.com/trueberryless)! - Sort summary list alphabetically

## 0.10.4

### Patch Changes

- [`b6b6fd0`](https://github.com/trueberryless/template-files/commit/b6b6fd0fb19449e5e142d5a4ca7a65293b1bc366) Thanks [@trueberryless](https://github.com/trueberryless)! - Update changeset and prettier packages

## 0.10.3

### Patch Changes

- [`0ca6b52`](https://github.com/trueberryless/template-files/commit/0ca6b52d0a800d3b21a8d3455652591725811113) Thanks [@trueberryless](https://github.com/trueberryless)! - Disable persist credentials on checkout action

## 0.10.2

### Patch Changes

- [`860aeff`](https://github.com/trueberryless/template-files/commit/860aeff044abe0e3df9c232d72e0d3648bf05486) Thanks [@trueberryless](https://github.com/trueberryless)! - Update GitHub Actions and NPM Dependencies

## 0.10.1

### Patch Changes

- [`38e07c4`](https://github.com/trueberryless/template-files/commit/38e07c4d88c1d243a3e5eb276ea43046aeb01d6e) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove NPM_TOKENs from GitHub Actions

## 0.10.0

### Minor Changes

- [`bae0635`](https://github.com/trueberryless/template-files/commit/bae0635157b3f671651e29fa08d76d9ffc51d3c6) Thanks [@trueberryless](https://github.com/trueberryless)! - Add support for OIDC by upgrading Node versions and removing --provenance flag

## 0.9.2

### Patch Changes

- [#203](https://github.com/trueberryless/template-files/pull/203) [`b86bbbd`](https://github.com/trueberryless/template-files/commit/b86bbbdadabd8506a524039ecbdee9528c0d218d) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Sidebar Clickable Groups plugin to repos.json

## 0.9.1

### Patch Changes

- [`940b0db`](https://github.com/trueberryless/template-files/commit/940b0db6b6d0302ad37d5f0bf7d9005894e27a68) Thanks [@trueberryless](https://github.com/trueberryless)! - Group npm updates into one Renovate PR

## 0.9.0

### Minor Changes

- [`9c2d1fa`](https://github.com/trueberryless/template-files/commit/9c2d1fab3cfce22939f4cc224f9f27d1051b792b) Thanks [@trueberryless](https://github.com/trueberryless)! - Add `CODEOWNERS` file to all repos ([@trueberryless](https://github.com/trueberryless) for all files)

## 0.8.3

### Patch Changes

- [`1110f2a`](https://github.com/trueberryless/template-files/commit/1110f2ac34c5a7545bc7717ca2b73bceb656224d) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Carbon Ads to repos

## 0.8.2

### Patch Changes

- [`85077f2`](https://github.com/trueberryless/template-files/commit/85077f212500ac8aadde0800a56d835ffc6291ab) Thanks [@trueberryless](https://github.com/trueberryless)! - Skip all CIs and reviews for update PRs

## 0.8.1

### Patch Changes

- [`0177638`](https://github.com/trueberryless/template-files/commit/01776388c1430272d3f263319272e4c4a15bf6d5) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix renovate configuration

## 0.8.0

### Minor Changes

- [#171](https://github.com/trueberryless/template-files/pull/171) [`2ef4755`](https://github.com/trueberryless/template-files/commit/2ef4755bfadf978d9e7ed4d83caefbbea003e7e5) Thanks [@trueberryless](https://github.com/trueberryless)! - Add new special file treatment: delete (path still needed nonetheless, although unused)

- [#171](https://github.com/trueberryless/template-files/pull/171) [`2ef4755`](https://github.com/trueberryless/template-files/commit/2ef4755bfadf978d9e7ed4d83caefbbea003e7e5) Thanks [@trueberryless](https://github.com/trueberryless)! - Rename renovate.json5 to renovate.json and adapt it to include npm updates (major and non-major)

## 0.7.2

### Patch Changes

- [`b518adc`](https://github.com/trueberryless/template-files/commit/b518adc0caed7160d41d3aaa655164888f68d7a1) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix next theme rename

## 0.7.1

### Patch Changes

- [`2298524`](https://github.com/trueberryless/template-files/commit/229852437e3558f59c72d5fb0452a2d2ae92c0cf) Thanks [@trueberryless](https://github.com/trueberryless)! - Add implications-trainer

## 0.7.0

### Minor Changes

- [#164](https://github.com/trueberryless/template-files/pull/164) [`a04a5d5`](https://github.com/trueberryless/template-files/commit/a04a5d5ed50be6febb1673740c76195c54adfc8f) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Plugin Translations repo

## 0.6.12

### Patch Changes

- [#161](https://github.com/trueberryless/template-files/pull/161) [`1a30bf8`](https://github.com/trueberryless/template-files/commit/1a30bf83699cf6e1e16bb43f3094d8bcc9cc9af6) Thanks [@trueberryless](https://github.com/trueberryless)! - Add true tracker repo to repos.json

## 0.6.11

### Patch Changes

- [#156](https://github.com/trueberryless/template-files/pull/156) [`c881634`](https://github.com/trueberryless/template-files/commit/c8816348c89885cf7d7d303fa2ae1f2fcdba2fb2) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove parts of trueberryless repo sync because it is now deployed with Netlify

## 0.6.10

### Patch Changes

- [`6903fb2`](https://github.com/trueberryless/template-files/commit/6903fb2b332356bdb556d1ad8427ec4b8189e58f) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Scroll Indicator repo

## 0.6.9

### Patch Changes

- [`e467d7b`](https://github.com/trueberryless/template-files/commit/e467d7b45a5b143378fe6695bcff962d497a0e91) Thanks [@trueberryless](https://github.com/trueberryless)! - Netlify videos, blog and github-activity and upgrade pnpm to 10.10

## 0.6.8

### Patch Changes

- [`634f697`](https://github.com/trueberryless/template-files/commit/634f697601c47b8d4edecad25b98a37c30258a88) Thanks [@trueberryless](https://github.com/trueberryless)! - Add package.json definitions for Starlight plugins

## 0.6.7

### Patch Changes

- [`cf36636`](https://github.com/trueberryless/template-files/commit/cf36636f9690dccbbdcae66cee5f4714f6075065) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix deployment and publishing issue with colon"

## 0.6.6

### Patch Changes

- [#141](https://github.com/trueberryless/template-files/pull/141) [`a1334b6`](https://github.com/trueberryless/template-files/commit/a1334b69dfbeed267814934db854c6f0a308ac4b) Thanks [@trueberryless](https://github.com/trueberryless)! - Add NextJS theme and remove minimalistic theme sync

## 0.6.5

### Patch Changes

- [#138](https://github.com/trueberryless/template-files/pull/138) [`8f52c2d`](https://github.com/trueberryless/template-files/commit/8f52c2dc5a2df677454f0d93b5b18262b82cd42b) Thanks [@trueberryless](https://github.com/trueberryless)! - Rename CI commits from [ci] to ci:

## 0.6.4

### Patch Changes

- [`1a357ba`](https://github.com/trueberryless/template-files/commit/1a357ba7bdf5d4613d55d4d43fdc81fc29ac7db7) Thanks [@trueberryless](https://github.com/trueberryless)! - Add ignore option to changeset config

## 0.6.3

### Patch Changes

- [`980560f`](https://github.com/trueberryless/template-files/commit/980560f4be1feebff58161707b7858dc86be7904) Thanks [@trueberryless](https://github.com/trueberryless)! - Add changeset commit message manipulation to publish action

## 0.6.2

### Patch Changes

- [`8d82201`](https://github.com/trueberryless/template-files/commit/8d8220136f495d243e2d5c5c6fdd33c5c5b9161a) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove sync for all files unnecessary for Netlify

## 0.6.1

### Patch Changes

- [#126](https://github.com/trueberryless/template-files/pull/126) [`9eaf262`](https://github.com/trueberryless/template-files/commit/9eaf26216bccef62626fc1f40bae5f59c5dfc90d) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Toc Overview Costomizer plugin to repos

## 0.6.0

### Minor Changes

- [#123](https://github.com/trueberryless/template-files/pull/123) [`b0cefd0`](https://github.com/trueberryless/template-files/commit/b0cefd08e85793d58973c98fafb79a0886401521) Thanks [@renovate](https://github.com/apps/renovate)! - Update GitHub action major versions

## 0.5.2

### Patch Changes

- [#111](https://github.com/trueberryless/template-files/pull/111) [`5c26f89`](https://github.com/trueberryless/template-files/commit/5c26f8912d51d017192a42a223e4f60645ee049d) Thanks [@trueberryless](https://github.com/trueberryless)! - Add renovate bot and config to all repos

## 0.5.1

### Patch Changes

- [#109](https://github.com/trueberryless/template-files/pull/109) [`31285c6`](https://github.com/trueberryless/template-files/commit/31285c6fb9a8bfe105bd876111cab6120b091411) Thanks [@trueberryless](https://github.com/trueberryless)! - Add new Download Link project to repos.json

## 0.5.0

### Minor Changes

- [#105](https://github.com/trueberryless/template-files/pull/105) [`64ec038`](https://github.com/trueberryless/template-files/commit/64ec03873817d015f91ae62f6d4f60dbbd8d9085) Thanks [@trueberryless](https://github.com/trueberryless)! - Add sort import order and Astro integration to prettier

### Patch Changes

- [#107](https://github.com/trueberryless/template-files/pull/107) [`de0253b`](https://github.com/trueberryless/template-files/commit/de0253b507255cd9dfccc5fc69d4151d0aa7625c) Thanks [@trueberryless](https://github.com/trueberryless)! - Remove readmetree from all projects except template-files itself

## 0.4.2

### Patch Changes

- [`1146c8d`](https://github.com/trueberryless/template-files/commit/1146c8dbbbaaa8d194060bd540eb2587b46402c0) Thanks [@trueberryless](https://github.com/trueberryless)! - Add package name to changeset commit message

- [`113aa7f`](https://github.com/trueberryless/template-files/commit/113aa7f27accd2288e952f0b965a873da619dea6) Thanks [@trueberryless](https://github.com/trueberryless)! - Make package suffix "-docs" optional by passing additional "packageSuffix" prop

## 0.4.1

### Patch Changes

- [`829a3b7`](https://github.com/trueberryless/template-files/commit/829a3b7d1f2a57938c55b41ab55978ed7c214340) Thanks [@trueberryless](https://github.com/trueberryless)! - Add truzzles, marketing & withastr-github-comment-templates repos

## 0.4.0

### Minor Changes

- [`b35291a`](https://github.com/trueberryless/template-files/commit/b35291a91a0038089a67dc57f9b9171b835c3557) Thanks [@trueberryless](https://github.com/trueberryless)! - Add "add-additional-lines" logic. But be careful: DO NOT use it on any files where inline contents will change (e.g. the change a folder in a path) because then the "comm" command wrongly interprets the output. Reference: https://chatgpt.com/share/67c8ae80-aa18-800b-9b88-a62393ddbe08

## 0.3.0

### Minor Changes

- [`f04e6fa`](https://github.com/trueberryless/template-files/commit/f04e6fa1976148311c4eb79940492e69cd57105d) Thanks [@trueberryless](https://github.com/trueberryless)! - Ignore ports, containerPort and targetPort in manifest special handling

## 0.2.0

### Minor Changes

- [#92](https://github.com/trueberryless/template-files/pull/92) [`4c2666d`](https://github.com/trueberryless/template-files/commit/4c2666d7b95c793e80e3cfb8672cbbcc55da8300) Thanks [@trueberryless](https://github.com/trueberryless)! - Every changeset commit will include the version of the package in all repos

## 0.1.18

### Patch Changes

- [#90](https://github.com/trueberryless/template-files/pull/90) [`238b885`](https://github.com/trueberryless/template-files/commit/238b885e157d66fa1ec1539daff29ca715c331ed) Thanks [@trueberryless](https://github.com/trueberryless)! - Add releases repo

## 0.1.17

### Patch Changes

- [#87](https://github.com/trueberryless/template-files/pull/87) [`ee763df`](https://github.com/trueberryless/template-files/commit/ee763df5c345df90de39e4484be87e10a534e582) Thanks [@trueberryless](https://github.com/trueberryless)! - Add DotNet Support: Release Image Generator

## 0.1.16

### Patch Changes

- [#84](https://github.com/trueberryless/template-files/pull/84) [`13e6389`](https://github.com/trueberryless/template-files/commit/13e63895646942633aa8e6315e1219b092a6d1ac) Thanks [@trueberryless](https://github.com/trueberryless)! - Add subtle-top-level-items-repo to repos.json

## 0.1.15

### Patch Changes

- [`d27bddb`](https://github.com/trueberryless/template-files/commit/d27bddb5d89d3388e9ae3a0f136f0e62d81e7e02) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Automatic Overview Pages

## 0.1.14

### Patch Changes

- [#77](https://github.com/trueberryless/template-files/pull/77) [`50a2279`](https://github.com/trueberryless/template-files/commit/50a22792a4245fea7f38bf850ffee6a5338b0d96) Thanks [@trueberryless](https://github.com/trueberryless)! - Add GitHub Activity repo to repos.json

## 0.1.13

### Patch Changes

- [`b09b4e3`](https://github.com/trueberryless/template-files/commit/b09b4e3d739f7a3afb43478dedf05328e5818644) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Minimalistic Theme

## 0.1.12

### Patch Changes

- [`6aeed6b`](https://github.com/trueberryless/template-files/commit/6aeed6be8a04556b0b80e90feb613c97df4a42f7) Thanks [@trueberryless](https://github.com/trueberryless)! - Add videos repository to `repos.json`.

## 0.1.11

### Patch Changes

- [`55a6fa6`](https://github.com/trueberryless/template-files/commit/55a6fa61359235f770f72adf2a73a709ec8c4e4c) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Spell Checker Plugin to repos.json

## 0.1.10

### Patch Changes

- [`62446dd`](https://github.com/trueberryless/template-files/commit/62446dd3f83da4978655c71a2acf391e3865638a) Thanks [@trueberryless](https://github.com/trueberryless)! - Use GitHub App trueberryless to make all CI

## 0.1.9

### Patch Changes

- [#61](https://github.com/trueberryless/template-files/pull/61) [`f7500e4`](https://github.com/trueberryless/template-files/commit/f7500e4c268aafd6e2e660a23001743fd337097d) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Starlight Sidebar Swipe Plugin to repos.json

## 0.1.8

### Patch Changes

- [#55](https://github.com/trueberryless/template-files/pull/55) [`58226a7`](https://github.com/trueberryless/template-files/commit/58226a76c834d0fcdf4430863f36227c3317eeeb) Thanks [@trueberryless](https://github.com/trueberryless)! - Use autofix to automatically format and optimize png images

## 0.1.7

### Patch Changes

- [`9cd54ca`](https://github.com/trueberryless/template-files/commit/9cd54caabc48191dfdef745f1cc0cb33587a2222) Thanks [@trueberryless](https://github.com/trueberryless)! - Sync batch-management-system + refactor .prettierrc & Dockerfile

## 0.1.6

### Patch Changes

- [`362703d`](https://github.com/trueberryless/template-files/commit/362703df8245ff55116049831aee8df020bec2ca) Thanks [@trueberryless](https://github.com/trueberryless)! - Add labeler and label manager

## 0.1.5

### Patch Changes

- [`fd4d152`](https://github.com/trueberryless/template-files/commit/fd4d15253c55cca2ede222c550ef4878619065e3) Thanks [@trueberryless](https://github.com/trueberryless)! - Prettier ignores changeset, Markdown and MDX files

## 0.1.4

### Patch Changes

- [`4efc863`](https://github.com/trueberryless/template-files/commit/4efc863e414b779d85cd826e20f5a73f3447dd6a) Thanks [@trueberryless](https://github.com/trueberryless)! - Add Mutanuq to repos.json

## 0.1.3

### Patch Changes

- [`66ae7c0`](https://github.com/trueberryless/template-files/commit/66ae7c03ec4b988813ec59436e60b23491f1ce99) Thanks [@trueberryless](https://github.com/trueberryless)! - Add all starlight plugin repos to repos.json

## 0.1.2

### Patch Changes

- [`7cd5c03`](https://github.com/trueberryless/template-files/commit/7cd5c0306fbe930d2348e891afda85b733a0e35e) Thanks [@trueberryless](https://github.com/trueberryless)! - Add .prettierignore, format.yaml and many other cool stuff tbh

## 0.1.1

### Patch Changes

- [`c8f85f4`](https://github.com/trueberryless/template-files/commit/c8f85f4cd369acdd82bed5d0c13c39bff2edf3d7) Thanks [@trueberryless](https://github.com/trueberryless)! - Add synchronization table to release outputs

## 0.1.3

### Patch Changes

- [`2e83bc8`](https://github.com/trueberryless/template-files/commit/2e83bc8b07581ef18b5bd859fd79e05577f960fa) Thanks [@trueberryless](https://github.com/trueberryless)! - Try stupid things from the internet

## 0.1.2

### Patch Changes

- [`9d6cf28`](https://github.com/trueberryless/template-files/commit/9d6cf281cd199b89e0351533d0ff897bb154b502) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix GitHub Action environmental variable saving issue

## 0.1.1

### Patch Changes

- [`f6ab349`](https://github.com/trueberryless/template-files/commit/f6ab349c2ac4c98f4763d44cbcb4d9d2247ff685) Thanks [@trueberryless](https://github.com/trueberryless)! - Fix GitHub Action environmental variable saving issue

## 0.1.0

### Minor Changes

- [`b0e9fbd`](https://github.com/trueberryless/template-files/commit/b0e9fbd40b0c8f67cf7a38ea31a9867b9092596b) Thanks [@trueberryless](https://github.com/trueberryless)! - Finish basic sync GitHub Action and many small improvements

## 0.0.3

### Patch Changes

- [`c57b8d3`](https://github.com/trueberryless/template-files/commit/c57b8d34c0222683b095ac32c2b565ce6c46e7a1) Thanks [@trueberryless](https://github.com/trueberryless)! - Update publish and deployment actions so they skip release and discord notification if tag already exists

## 0.0.2

### Patch Changes

- [`42e078d`](https://github.com/trueberryless/template-files/commit/42e078dbe2954d1732dcd2911b88ebaf464ce008) Thanks [@trueberryless](https://github.com/trueberryless)! - Add manifest and .changeset files

## 0.0.1

### Patch Changes

- [`5ff470e`](https://github.com/trueberryless/template-files/commit/5ff470e93d072a8b862d329a4aba2e80c27c1f95) Thanks [@trueberryless](https://github.com/trueberryless)! - Create single source of truth for ci files
