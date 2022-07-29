import { join } from 'path'
import type { StorybookViteConfig, ViteFinal } from '@storybook/builder-vite'
import type { InlineConfig } from 'vite'
import { defineConfig, mergeConfig } from 'vite'
import { getPackageInfo } from './find-all-packages'
import type { PackageInfo } from './types'
import { packageInfoUtils } from './package-info-utils'

const defineOverviewConfig = (packageInfo: PackageInfo, config: Record<string, any>): InlineConfig => {
  const cwd = process.env.__BOOKCASE_BUILDER_ROOT__ as string
  const { basePath, outDir: output } = packageInfoUtils(packageInfo, cwd)

  delete config?.build?.lib
  delete config?.build?.rollupOptions?.external

  return mergeConfig(
    config,
    defineConfig({
      mode: 'production',
      base: basePath,
      build: { outDir: output },
    }),
  )
}

const defineManagerConfig = (packageInfo: PackageInfo, config: Record<string, any>): Record<string, any> => {
  const cwd = process.env.__BOOKCASE_BUILDER_ROOT__ as string
  const { basePath } = packageInfoUtils(packageInfo, cwd)

  config.output.publicPath = basePath

  return config
}

export const withOverview
  = (__dirname: string) =>
    (_config: Omit<StorybookViteConfig, 'viteFinal'> & { viteFinal?: ViteFinal; managerWebpack?: (...args: any[]) => any }): any => {
      if (!process.env.__BOOKCASE_BUILDER_FLAG__)
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

      const viteFinal: ViteFinal = async (...args: Parameters<ViteFinal>) => {
        const config = (await _config.viteFinal?.(...args as Parameters<typeof _config.viteFinal>)) || args?.[0]
        return defineOverviewConfig(packageInfo, config) as ReturnType<ViteFinal>
      }

      return {
        ..._config,
        managerWebpack,
        features: { ...(_config.features || {}), buildStoriesJson: _config?.features?.buildStoriesJson ?? true },
        viteFinal,
      }
    }
