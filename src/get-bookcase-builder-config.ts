import { readFileSync } from 'fs'
import { join } from 'path'
import type { BookcaseBuilderConfig } from './types'

export function getBookcaseBuilderBConfig(packagePath: string): BookcaseBuilderConfig {
  const packageJsonPath = join(packagePath, 'package.json')
  const result = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as any
  if (!result)
    return {}

  const config = result?.['bookcase-builder'] as BookcaseBuilderConfig

  return config
}
