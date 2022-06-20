import { join } from 'path'
import cp from 'child_process'
import { cwd } from 'process'
import { validateConfigs } from './validation'
import { chalkSuccess, logError, logNormal, logSuccess, logWarning } from './log'
import { packageInfoUtils } from './package-info-utils'

import './cli'
import { findAllPackagesInfo } from './find-all-packages'

export function build() {
  // const overviewPackageInfo = getOverviewInfo()
  const allPackagesInfo = findAllPackagesInfo({ valid: true })
  const isValid = validateConfigs(allPackagesInfo)

  if (!isValid)
    return undefined

  if (allPackagesInfo.length) {
    logNormal(`Found ${allPackagesInfo.length} package${allPackagesInfo.length > 1 ? 's' : ''}...`)
    const maxLength = allPackagesInfo.reduce((length, info) => {
      const {
        basename,
      } = packageInfoUtils(info)

      if (basename.length > length)
        return basename.length
      return length
    }, 0)

    allPackagesInfo.forEach((info) => {
      const { packagePath } = info
      const {
        basename,
      } = packageInfoUtils(info)

      logNormal(`${chalkSuccess(`[${basename}]`.padEnd(maxLength + 5, ' '))}|__${packagePath}`)
    })
  }
  else {
    logWarning('No packages found.')
  }

  const results = allPackagesInfo.map((info) => {
    const { packagePath, isOverview } = info
    const {
      basename, storybookDir, outputDir, basePath,
    } = packageInfoUtils(info)

    const name = `[${basename}]`

    logNormal(`Building bookcase for package ${chalkSuccess(name)}`)
    logNormal(`Path: ${packagePath}`)

    let injectEnv = 'npx cross-env __BOOKCASE_BUILDER_FLAG__=true '

    if (isOverview)
      injectEnv += `__BOOKCASE_BUILDER_PATH__=${cwd()}`

    const buildCommand = `${injectEnv} npx build-storybook -c ${storybookDir} -o ${outputDir} --no-manager-cache --preview-url ${join(
      basePath,
      'iframe.html',
    )} --force-build-preview`

    try {
      logNormal(buildCommand)
      cp.execSync(buildCommand, { stdio: 'inherit', cwd: packagePath })
    }
    catch (e: any) {
      logError(e)
      logError(`Package ${name} failed to build. skipping...`)

      return {
        log: () => logError(`${name} ❌`),
        success: false,
      }
    }

    return {
      log: () => logSuccess(`${name} ✅`),
      success: true,
    }
  })

  logNormal(`Build complete. ${results.filter(({ success }) => success).length} succeeded, ${results.filter(({ success }) => !success).length} failed.`)

  results.map(({ log }) => log())
}

build()
