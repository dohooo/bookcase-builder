import path, { join } from 'path'
import cp from 'child_process'
import { cwd } from 'process'
import { validateConfigs } from './validation'
import { chalkSuccess, logError, logNormal, logSuccess, logWarning } from './log'
import { packageInfoUtils } from './package-info-utils'

import { findAllPackagesInfo } from './find-all-packages'
import { getBookcaseBuilderConfig } from './get-bookcase-builder-config'
import type { BookcaseBuilderConfig } from './types'

const build = () => {
  const GLOBAL_CONFIG: Partial<BookcaseBuilderConfig> = getBookcaseBuilderConfig(cwd()) || {}
  const allPackagesInfo = findAllPackagesInfo({ valid: true })
  const isValid = validateConfigs(allPackagesInfo)

  if (!isValid)
    return undefined

  if (allPackagesInfo.length) {
    logNormal(`Found ${allPackagesInfo.length} package${allPackagesInfo.length > 1 ? 's' : ''}...`)
    const maxLength = allPackagesInfo.reduce((length, info) => {
      const {
        basename,
      } = packageInfoUtils(info, cwd())

      if (basename.length > length)
        return basename.length
      return length
    }, 0)

    allPackagesInfo.forEach((info) => {
      const { packagePath, packageJson } = info
      const name = packageJson?.name || path.basename(packagePath)

      logNormal(`${chalkSuccess(`[${name}]`.padEnd(maxLength + 5, ' '))}|__${packagePath}`)
    })
  }
  else {
    logWarning('No packages found.')
  }

  const results = allPackagesInfo.map((info) => {
    const { packagePath, packageJson } = info

    const {
      storybookDir, basePath, outDir: output,
    } = packageInfoUtils(info, cwd())

    const name = `[${packageJson?.name || path.basename(packagePath)}]`

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

    // Append to the build-storybook parameter to prevent the build-storybook command execution.
    const bbArgv = process.argv.slice(2).join(' ')

    const buildCommand = `${packageManager} build-storybook ${bbArgv} --config-dir ${storybookDir} --output-dir ${output} --no-manager-cache --preview-url ${join(
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
