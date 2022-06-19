export type BookcaseBuilderConfig = Partial<{
  workspaces: string[]
  output: string
  publicURL: string
  basename: string
  storybook: Partial<{
    configDir: string
  }>
}>

export interface PackageInfo {
  packagePath: string
  bookcaseBuilderConfig: BookcaseBuilderConfig
}
