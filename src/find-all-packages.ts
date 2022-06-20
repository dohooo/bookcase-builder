import { join } from 'path'
import glob from 'glob'
import { getBookcaseBuilderBConfig } from './get-bookcase-builder-config'
import type { BookcaseBuilderConfig, PackageInfo } from './types'

export function getPackageInfo(packagePath: string): PackageInfo {
  return {
    packagePath,
    bookcaseBuilderConfig: getBookcaseBuilderBConfig(packagePath),
  }
}

export function findAllPackagesInfo(options: { valid?: boolean; cwd?: string } = {}) {
  const { valid = false, cwd = process.cwd() } = options
  const config: Partial<BookcaseBuilderConfig> = getBookcaseBuilderBConfig(cwd) || {}
  const workspaces = config.workspaces || []
  const packagesInfo: PackageInfo[] = []
  workspaces.forEach((pattern) => {
    const packagesRelativePath = glob.sync(pattern, { cwd })
    packagesInfo.push(...packagesRelativePath.map<PackageInfo>((relativePath) => {
      return getPackageInfo(join(cwd, relativePath))
    }))
  })

  if (valid)
    return packagesInfo.filter(({ bookcaseBuilderConfig }) => !!bookcaseBuilderConfig)

  return packagesInfo
}
