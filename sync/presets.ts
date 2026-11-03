import type { Repository } from "./config.ts";
import { getRepositoryProps } from "./props.ts";
import type { Operation, Props } from "./types.ts";

const PACKAGE_JSON = "package.json";

export function getOperations(repository: Repository): Operation[] {
  const props = getRepositoryProps(repository);

  return [
    ...getCommonOperations(repository, props),
    ...getPresetOperations(repository, props),
    // Last, so the workflow is trimmed to the package.json scripts as the other operations left them.
    ci(".github/workflows/ci.yaml", ".github/workflows/ci.yaml", props),
  ].filter((operation) => !isSkipped(operation, repository.skip));
}

function isSkipped(operation: Operation, skip: string[]) {
  return (
    skip.includes(operation.target) ||
    ("source" in operation && skip.includes(operation.source))
  );
}

function getCommonOperations(
  repository: Repository,
  props: Props
): Operation[] {
  const isOxfmt = repository.formatter === "oxfmt";

  return [
    copy(".github/labeler.yaml", ".github/labeler.yaml", props),
    copy(".github/renovate.json", ".github/renovate.json", props),
    copy(
      isOxfmt
        ? ".github/workflows/format.oxfmt.yaml"
        : ".github/workflows/format.yaml",
      ".github/workflows/format.yaml",
      props
    ),
    copy(
      ".github/workflows/labeler.yaml",
      ".github/workflows/labeler.yaml",
      props
    ),
    copy(
      ".github/workflows/welcome-bot.yaml",
      ".github/workflows/welcome-bot.yaml",
      props
    ),
    copy("LICENSE", "LICENSE", props),
    addMissingLines(".gitignore/Node.gitignore", ".gitignore", props),
    ...(isOxfmt
      ? [
          copy("oxfmt/.oxfmtrc.json", ".oxfmtrc.json", props),
          remove(".prettierrc"),
          remove(".prettierignore"),
        ]
      : [
          copy(".prettierrc/.prettierrc", ".prettierrc", props),
          addMissingLines(".prettierignore", ".prettierignore", props),
        ]),
    remove(".github/CODEOWNERS"),
    remove(".github/renovate.json5"),
    remove(".github/workflows/tangle.yaml"),
  ];
}

function getPresetOperations(
  repository: Repository,
  props: Props
): Operation[] {
  switch (repository.preset) {
    case "site": {
      return [
        ...getSiteOperations(repository, props),
        mergeJson("package.json/definition.package.json", PACKAGE_JSON, props),
        ...getRootPackageOperations(repository, props),
        mergeYaml("pnpm-workspace/site.yaml", "pnpm-workspace.yaml", props),
        replaceLicense("README.md", "README.md", props),
      ];
    }
    case "plugin": {
      const packagePath = `packages/${props.packageDirectory}`;

      return [
        copy(".changeset/config.json", ".changeset/config.json", props),
        copy(".changeset/README.md", ".changeset/README.md", props),
        copy(
          ".github/workflows/publish.yaml",
          ".github/workflows/publish.yaml",
          props
        ),
        mergeJson("package.json/definition.package.json", PACKAGE_JSON, {
          ...props,
          homepage: props.repositoryUrl!,
          packageName: `${props.packageName}-monorepo`,
        }),
        mergeJson("package.json/changeset.package.json", PACKAGE_JSON, props),
        ...getRootPackageOperations(repository, props),
        mergeJson("package.json/definition.package.json", "docs/package.json", {
          ...props,
          packageName: `${props.packageName}-docs`,
        }),
        ...getPackageManagerOperations("docs/package.json", props),
        mergeJson(
          "package.json/definition.package.json",
          `${packagePath}/package.json`,
          props
        ),
        replaceLicense("README.md", `${packagePath}/README.md`, props),
        mergeYaml("pnpm-workspace/plugin.yaml", "pnpm-workspace.yaml", props),
      ];
    }
    case "tooling": {
      return [
        copy(".changeset/config.json", ".changeset/config.json", props),
        copy(".changeset/README.md", ".changeset/README.md", props),
        mergeJson("package.json/definition.package.json", PACKAGE_JSON, props),
        mergeJson("package.json/changeset.package.json", PACKAGE_JSON, props),
        ...getRootPackageOperations(repository, props),
        mergeYaml("pnpm-workspace/site.yaml", "pnpm-workspace.yaml", props),
        replaceLicense("README.md", "README.md", props),
      ];
    }
  }
}

function getSiteOperations(repository: Repository, props: Props): Operation[] {
  if (!repository.ci) {
    return [];
  }

  return [
    copy(".oxlintrc.json", ".oxlintrc.json", props),
    mergeJson(
      repository.formatter === "oxfmt"
        ? "package.json/testing.oxfmt.package.json"
        : "package.json/testing.package.json",
      PACKAGE_JSON,
      props
    ),
  ];
}

function getPackageManagerOperations(
  target: string,
  props: Props
): Operation[] {
  return [
    mergeJson("package.json/package.manager.package.json", target, props),
  ];
}

function getRootPackageOperations(
  repository: Repository,
  props: Props
): Operation[] {
  const formatterFragment =
    repository.formatter === "oxfmt"
      ? "package.json/oxfmt.package.json"
      : "package.json/prettier.package.json";

  return [
    ...getPackageManagerOperations(PACKAGE_JSON, props),
    mergeJson(formatterFragment, PACKAGE_JSON, props),
  ];
}

function copy(source: string, target: string, props: Props): Operation {
  return { props, source, target, type: "copy" };
}

function ci(source: string, target: string, props: Props): Operation {
  return { props, source, target, type: "ci" };
}

function mergeJson(source: string, target: string, props: Props): Operation {
  return { props, source, target, type: "merge-json" };
}

function mergeYaml(source: string, target: string, props: Props): Operation {
  return { props, source, target, type: "merge-yaml" };
}

function addMissingLines(
  source: string,
  target: string,
  props: Props
): Operation {
  return { props, source, target, type: "add-missing-lines" };
}

function replaceLicense(
  source: string,
  target: string,
  props: Props
): Operation {
  return { props, source, target, type: "replace-license" };
}

function remove(target: string): Operation {
  return { target, type: "delete" };
}
