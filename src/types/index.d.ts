export type BookcaseBuilderConfig = Partial<{
  workspaces: string[]
  output: string
  publicURL: string
  basename: string
  packageManager: 'yarn' | 'npm' | 'pnpm'
  storybook: Partial<{
    configDir: string
  }>
}>

export interface PackageInfo {
  packagePath: string
  packageJson?: Record<any, any>
  bookcaseBuilderConfig?: BookcaseBuilderConfig
}
