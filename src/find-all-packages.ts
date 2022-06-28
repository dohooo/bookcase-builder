import { join } from 'path'
import glob from 'glob'
import { getBookcaseBuilderConfig } from './get-bookcase-builder-config'
import type { BookcaseBuilderConfig, PackageInfo } from './types'
import { getPackageJson } from './get-package-json'

export function getPackageInfo(packagePath: string): PackageInfo {
  const packageJson = getPackageJson(packagePath)
  const bookcaseBuilderConfig = getBookcaseBuilderConfig(packagePath)

  return {
    packagePath,
    packageJson,
    bookcaseBuilderConfig,
  }
}

export function findAllPackagesInfo(options: { valid?: boolean; cwd?: string } = {}) {
  const { valid = false, cwd = process.cwd() } = options
  const config: Partial<BookcaseBuilderConfig> = getBookcaseBuilderConfig(cwd) || {}
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
