import { join } from 'path'
import cp from 'child_process'
import { cwd } from 'process'
import { validateConfigs } from './validation'
import { chalkSuccess, logError, logNormal, logSuccess, logWarning } from './log'
import { packageInfoUtils } from './package-info-utils'

import { cli } from './cli'
import { findAllPackagesInfo } from './find-all-packages'
import type { BookcaseBuilderConfig } from './types'
import { getBookcaseBuilderBConfig } from './get-bookcase-builder-config'

export const GLOBAL_CONFIG: Partial<BookcaseBuilderConfig> = getBookcaseBuilderBConfig(cwd()) || {}

const build = () => {
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
    const { packagePath } = info

    const {
      basename, storybookDir, basePath,
    } = packageInfoUtils(info)
    const outputDir = join(cwd(), cli.flags.output || GLOBAL_CONFIG.output || '', basename)
    const name = `[${basename}]`

    logNormal(`Building bookcase for package ${chalkSuccess(name)}`)
    logNormal(`Path: ${packagePath}`)

    let packageManager = 'npx'

    switch (GLOBAL_CONFIG.packageManager) {
      case 'npm':
      case 'pnpm':
        break
      case 'yarn':
        packageManager = 'yarn'
        break
    }

    const buildCommand = `${packageManager} build-storybook -c ${storybookDir} -o ${outputDir} --no-manager-cache --preview-url ${join(
      basePath,
      'iframe.html',
    )} --force-build-preview`

    try {
      logNormal(buildCommand)
      cp.execSync(buildCommand, {
        stdio: 'inherit',
        cwd: packagePath,
        env: {
          ...process.env,
          __BOOKCASE_BUILDER_FLAG__: 'true',
          __BOOKCASE_BUILDER_ROOT__: cwd(),
        },
      })
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
