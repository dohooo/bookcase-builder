import path, { join } from 'path'
import { cli } from './cli'
import { getBookcaseBuilderConfig } from './get-bookcase-builder-config'
import type { BookcaseBuilderConfig, PackageInfo } from './types'

export function packageInfoUtils(packageInfo: PackageInfo) {
  return {
    basename: getBasename(packageInfo),
    storybookDir: getStorybookDir(packageInfo),
    basePath: getBasePath(packageInfo),
  }
}
function getBasePath(info: PackageInfo) {
  const GLOBAL_CONFIG: Partial<BookcaseBuilderConfig> = getBookcaseBuilderConfig(process?.env?.__BOOKCASE_BUILDER_ROOT__ as string || '') || {}
  const publicURL = cli.flags.publicURL || GLOBAL_CONFIG.publicURL || ''
  const basename = getBasename(info)
  return join('/', publicURL, basename, '/')
}

function getBasename(info: PackageInfo) {
  return info.bookcaseBuilderConfig?.basename ?? path.basename(info.packagePath)
}

export function getOutDir(info: PackageInfo, cwd: string) {
  const outputBasename = info.bookcaseBuilderConfig?.output ?? path.basename(info.packagePath)
  const GLOBAL_CONFIG: Partial<BookcaseBuilderConfig> = getBookcaseBuilderConfig(cwd) || {}
  const outputDir = join(cwd, cli.flags.output || GLOBAL_CONFIG.output || '', outputBasename)

  return outputDir
}

function getStorybookDir({ bookcaseBuilderConfig, packagePath }: PackageInfo) {
  return join(packagePath, bookcaseBuilderConfig?.storybook?.configDir || '.storybook')
}
