import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { BookcaseBuilderConfig } from './types'

export function getBookcaseBuilderBConfig(packagePath: string): BookcaseBuilderConfig | undefined {
  const packageJsonPath = join(packagePath, 'package.json')

  if (!existsSync(packageJsonPath))
    return undefined

  const result = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as any
  if (!result)
    return undefined

  const config = result?.['bookcase-builder'] as BookcaseBuilderConfig

  return config
}
