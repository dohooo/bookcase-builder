import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export function getPackageJson(packagePath: string): Record<any, any> | undefined {
  const packageJsonPath = join(packagePath, 'package.json')
  if (existsSync(packageJsonPath)) {
    const config = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    if (config)
      return config
  }

  return undefined
}
