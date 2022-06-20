import { join } from 'path'
import { cwd } from 'process'
import { cli } from './cli'
import type { PackageInfo } from './types'

export function packageInfoUtils(packageInfo: PackageInfo) {
  return {
    basename: getBasename(packageInfo),
    storybookDir: getStorybookDir(packageInfo),
    outputDir: getOutputDir(packageInfo),
    basePath: getBasePath(packageInfo),
  }
}

function getBasePath(info: PackageInfo) {
  const publicURL = cli.flags.publicURL || ''
  const basename = getBasename(info)
  return join(publicURL, basename, '/')
}

function getBasename(info: PackageInfo) {
  return info.bookcaseBuilderConfig.basename || info.packagePath.split('/').pop()!
}

function getOutputDir(packageInfo: PackageInfo) {
  const outputBaseDir = join(cwd(), cli.flags.output || '')
  const basename = getBasename(packageInfo)
  const outDir = join(outputBaseDir, basename)
  return outDir
}

function getStorybookDir({ bookcaseBuilderConfig, packagePath }: PackageInfo) {
  return join(packagePath, bookcaseBuilderConfig.storybook?.configDir || '.storybook')
}
