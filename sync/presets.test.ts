import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, test } from 'vitest'

import { parseConfig } from './config.ts'
import { getRepositoryProps, renderTemplate } from './props.ts'
import { getOperations } from './presets.ts'

const templatesPath = resolve(import.meta.dirname, '../templates')
const repositories = parseConfig(JSON.parse(readFileSync(resolve(import.meta.dirname, '../repositories.json'), 'utf8')))

describe('getRepositoryProps', () => {
  test('derives the defaults from the repository name', () => {
    expect(getRepositoryProps({ branch: 'main', ci: false, skip: [], formatter: 'prettier', name: 'owner/repo', preset: 'site' })).toMatchObject({
      homepage: 'https://repo.netlify.app/',
      owner: 'owner',
      packageDirectory: 'repo',
      packageName: 'repo',
      repositoryName: 'repo',
      repositoryUrl: 'https://github.com/owner/repo',
    })
  })

  test('strips the scope from the package directory', () => {
    const props = getRepositoryProps({ branch: 'main', ci: false, skip: [], formatter: 'prettier', name: 'owner/repo', package: '@owner/repo', preset: 'plugin' })

    expect(props.packageName).toBe('@owner/repo')
    expect(props.packageDirectory).toBe('repo')
  })
})

describe('renderTemplate', () => {
  test('replaces every placeholder', () => {
    expect(renderTemplate('<%= a %>-<%=b%>-<%= a %>', { a: '1', b: '2' })).toBe('1-2-1')
  })

  test('throws for unknown placeholders', () => {
    expect(() => renderTemplate('<%= missing %>', {})).toThrow(/missing/)
  })
})

describe('getOperations', () => {
  test.each(repositories.map(({ name }) => name))('%s only references existing, fully resolvable templates', (name) => {
    const repository = repositories.find((candidate) => candidate.name === name)!

    for (const operation of getOperations(repository)) {
      if (operation.type === 'delete') {
        continue
      }

      const path = resolve(templatesPath, operation.source)

      expect(existsSync(path), operation.source).toBe(true)
      expect(() => renderTemplate(readFileSync(path, 'utf8'), operation.props), operation.source).not.toThrow()
    }
  })

  test('skips operations by target or source', () => {
    const base = { branch: 'main', ci: false, name: 'owner/repo', preset: 'site', formatter: 'prettier' } as const
    const skip = ['.prettierrc', 'package.json/prettier.package.json']
    const operations = getOperations({ ...base, skip })

    expect(operations.map(({ target }) => target)).not.toContain('.prettierrc')
    expect(operations.map(({ target }) => target)).toContain('LICENSE')
    expect(operations.some((operation) => 'source' in operation && operation.source === skip[1])).toBe(false)
  })

  test('uses the oxfmt templates and removes the Prettier files for the oxfmt formatter', () => {
    const operations = getOperations({ branch: 'main', ci: true, formatter: 'oxfmt', name: 'owner/repo', preset: 'site', skip: [] })
    const targets = operations.map(({ target }) => target)
    const sources = operations.flatMap((operation) => ('source' in operation ? [operation.source] : []))

    expect(targets).toContain('.oxfmtrc.json')
    expect(sources).toContain('.github/workflows/format.oxfmt.yaml')
    expect(sources).toContain('package.json/oxfmt.package.json')
    expect(sources).toContain('package.json/testing.oxfmt.package.json')
    expect(sources).not.toContain('.prettierrc/.prettierrc')
    expect(operations.filter(({ type }) => type === 'delete').map(({ target }) => target)).toEqual(
      expect.arrayContaining(['.prettierrc', '.prettierignore']),
    )
  })

  test('uses the Prettier templates by default', () => {
    const targets = getOperations({ branch: 'main', ci: true, formatter: 'prettier', name: 'owner/repo', preset: 'site', skip: [] }).map(
      ({ target }) => target,
    )

    expect(targets).toContain('.prettierrc')
    expect(targets).not.toContain('.oxfmtrc.json')
  })

  test('only adds CI files when requested', () => {
    const base = { branch: 'main', name: 'owner/repo', preset: 'site', skip: [] as string[], formatter: 'prettier' } as const
    const targets = (ci: boolean) => getOperations({ ...base, ci }).map(({ target }) => target)

    expect(targets(false)).not.toContain('.github/workflows/ci.yaml')
    expect(targets(true)).toContain('.github/workflows/ci.yaml')
  })

  test.each(['site', 'plugin', 'tooling'] as const)('adds the supply chain workflow to the %s preset', (preset) => {
    const targets = getOperations({ branch: 'main', ci: false, skip: [], formatter: 'prettier', name: 'owner/repo', preset }).map(({ target }) => target)

    expect(targets).toContain('.github/workflows/supply-chain.yaml')
  })

  test('places plugin files in the package directory', () => {
    const targets = getOperations({ branch: 'main', ci: false, skip: [], formatter: 'prettier', name: 'owner/repo', package: '@owner/repo', preset: 'plugin' }).map(
      ({ target }) => target,
    )

    expect(targets).toContain('packages/repo/package.json')
    expect(targets).toContain('packages/repo/README.md')
  })
})
