import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { cli } from './cli'
import { getPackageJson } from './get-package-json'
import type { BookcaseBuilderConfig } from './types'

// bookcase-builder.json > package.json
export function getBookcaseBuilderConfig(packagePath: string): BookcaseBuilderConfig | undefined {
  const bookcaseBuilderJsonPath = join(packagePath, cli.flags.configFile || 'bookcase-builder.config.json')

  if (existsSync(bookcaseBuilderJsonPath)) {
    const config = JSON.parse(readFileSync(bookcaseBuilderJsonPath, 'utf8')) as any
    if (config)
      return config
  }

  const packageJson = getPackageJson(packagePath)
  const config = packageJson?.['bookcase-builder'] as BookcaseBuilderConfig
  if (config)
    return config

  return undefined
}
