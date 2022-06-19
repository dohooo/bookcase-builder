import { join } from 'path'
import cp from 'child_process'
import { findAllPackagesInfo } from './find-all-packages'
import { validateConfigs } from './validation'
import { chalkSuccess, logNormal, logWarning } from './log'
import { packageInfoUtils } from './package-info-utils'

import './cli'

export function build() {
  const allPackagesInfo = findAllPackagesInfo()
  const isValid = validateConfigs(allPackagesInfo)

  if (!isValid)
    return undefined

  const validPackages = allPackagesInfo.filter(({ bookcaseBuilderConfig }) => !!bookcaseBuilderConfig)

  if (validPackages.length) {
    logNormal(`Found ${validPackages.length} package${validPackages.length > 1 ? 's' : ''}...`)
    validPackages.forEach((info) => {
      const { packagePath } = info
      const {
        basename,
      } = packageInfoUtils(info)
      logNormal(`${chalkSuccess(`[${basename}]`)}|__${packagePath}`)
    })
  }
  else {
    logWarning('No packages found.')
  }

  validPackages.forEach((info) => {
    const { packagePath } = info
    const {
      basename, storybookDir, outputDir, basePath,
    } = packageInfoUtils(info)

    logNormal(`Building bookcase for package ${chalkSuccess(`[${basename}]`)}:`, packagePath)

    const buildCommand = `npx cross-env __BOOKCASE_BUILDER_FLAG__=true npx build-storybook -c ${storybookDir} -o ${outputDir} --no-manager-cache --preview-url ${join(
      basePath,
      'iframe.html',
    )} --force-build-preview`

    cp.execSync(buildCommand, { stdio: 'inherit', cwd: packagePath })
  })
}

build()
