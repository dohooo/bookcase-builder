// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import path, { join } from 'path'
import type { StorybookViteConfig, ViteFinal } from '@storybook/builder-vite'
import type { InlineConfig } from 'vite'
import { defineConfig, mergeConfig } from 'vite'
import { getPackageInfo } from './find-all-packages'
import type { PackageInfo } from './types'
import { packageInfoUtils } from './package-info-utils'

const OVERVIEW_BASE = '/builder-vite/'

function getBasePath(baseName: string) {
  return path.join(OVERVIEW_BASE, baseName, '/')
}

const defineOverviewConfig = (packageInfo: PackageInfo, config: Record<string, any>): InlineConfig => {
  const { basename, outputDir } = packageInfoUtils(packageInfo)

  return mergeConfig(
    config,
    defineConfig({
      mode: 'production',
      base: getBasePath(basename),
      build: { outDir: outputDir, rollupOptions: { external: [] } },
    }),
  )
}

const defineManagerConfig = (packageInfo: PackageInfo, config: Record<string, any>): Record<string, any> => {
  const { basename } = packageInfoUtils(packageInfo)
  config.output.publicPath = getBasePath(basename)
  return config
}

export const withOverview
  = (__dirname: string) =>
    (_config: Omit<StorybookViteConfig, 'viteFinal'> & { viteFinal?: ViteFinal }): StorybookViteConfig => {
      const isOverview = process.env.__BOOKCASE_BUILDER_FLAG__ === 'true'

      if (!isOverview)
        return _config

      if (_config?.core?.builder !== '@storybook/builder-vite')
        throw new Error('core.builder is not @storybook/builder-vite')

      if (_config?.features?.buildStoriesJson === false)
        throw new Error('features.buildStoriesJson is not enabled')

      const packageInfo = getPackageInfo(join(__dirname, '../'))

      const managerWebpack = async (...args: any[]) => {
        const config = (await _config.managerWebpack?.(...args)) || args?.[0]
        return defineManagerConfig(packageInfo, config)
      }

      const viteFinal: typeof _config['viteFinal'] = async (...args: any[]) => {
        const config = (await _config.viteFinal?.(...args)) || args?.[0]
        return defineOverviewConfig(packageInfo, config)
      }

      return {
        ..._config,
        managerWebpack,
        features: { ...(_config.features || {}), buildStoriesJson: _config?.features?.buildStoriesJson ?? true },
        viteFinal,
      }
    }
