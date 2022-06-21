import { join } from 'path'
import glob from 'glob'
import { getBookcaseBuilderBConfig } from './get-bookcase-builder-config'
import type { BookcaseBuilderConfig, PackageInfo } from './types'

export function getPackageInfo(packagePath: string): PackageInfo {
  const bookcaseBuilderConfig = getBookcaseBuilderBConfig(packagePath)

  return {
    packagePath,
    bookcaseBuilderConfig,
  }
}

export function findAllPackagesInfo(options: { valid?: boolean; cwd?: string } = {}) {
  const { valid = false, cwd = process.cwd() } = options
  const config: Partial<BookcaseBuilderConfig> = getBookcaseBuilderBConfig(cwd) || {}
  const workspaces = config.workspaces || []
  const packagesInfo: PackageInfo[] = []
  workspaces.forEach((pattern) => {
    const packagesRelativePath = glob.sync(pattern, { cwd })

    packagesRelativePath.forEach((relativePath) => {
      const packageInfo = getPackageInfo(join(cwd, relativePath))
      if (valid && packageInfo.bookcaseBuilderConfig)
        packagesInfo.push(packageInfo)

      else if (!valid) packagesInfo.push(packageInfo)
    })
  })

  return packagesInfo
}
