import { join } from 'path'
import { fileURLToPath } from 'url'
import type { PackageInfo } from './types'

export function getOverviewInfo(): PackageInfo {
  const packagePath = join(fileURLToPath(import.meta.url), '../../overview')
  return {
    packagePath,
    bookcaseBuilderConfig: {},
    isOverview: true,
  }
}
