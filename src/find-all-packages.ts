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

export function findAllPackagesInfo() {
  const cwd = process.cwd()
  const config: Partial<BookcaseBuilderConfig> = getBookcaseBuilderBConfig(cwd) || {}
  const workspaces = config.workspaces || []
  const packagesInfo: PackageInfo[] = []
  workspaces.forEach((pattern) => {
    const packagesRelativePath = glob.sync(pattern, { cwd })

    packagesInfo.push(...packagesRelativePath.map<PackageInfo>(relativePath => getPackageInfo(join(cwd, relativePath))))
  })

  return packagesInfo
}
