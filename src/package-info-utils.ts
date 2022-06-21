import { join } from 'path'
import { cli } from './cli'
import type { PackageInfo } from './types'

export function packageInfoUtils(packageInfo: PackageInfo) {
  return {
    basename: getBasename(packageInfo),
    storybookDir: getStorybookDir(packageInfo),
    basePath: getBasePath(packageInfo),
  }
}

function getBasePath(info: PackageInfo) {
  const publicURL = cli.flags.publicURL || ''
  const basename = getBasename(info)
  return join('/', publicURL, basename, '/')
}

function getBasename(info: PackageInfo) {
  return info.bookcaseBuilderConfig.basename || info.packagePath.split('/').filter(s => !!s).pop()!
}

function getStorybookDir({ bookcaseBuilderConfig, packagePath }: PackageInfo) {
  return join(packagePath, bookcaseBuilderConfig.storybook?.configDir || '.storybook')
}
