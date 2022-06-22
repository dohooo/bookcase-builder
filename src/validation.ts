import { join } from 'path'
import Ajv from 'ajv'
import type { JSONSchemaType } from 'ajv'
import { logError } from './log'
import type { BookcaseBuilderConfig, PackageInfo } from './types'

const ajv = new Ajv()

const schema: JSONSchemaType<BookcaseBuilderConfig> = {
  type: 'object',
  properties: {
    workspaces: { type: 'array', items: { type: 'string', nullable: true }, nullable: true },
    output: { type: 'string', nullable: true },
    packageManager: { type: 'string', nullable: true },
    basename: { type: 'string', nullable: true },
    publicURL: { type: 'string', nullable: true },
    storybook: { type: 'object', properties: { configDir: { type: 'string', nullable: true } }, nullable: true, additionalProperties: false },
  },
  additionalProperties: false,
}
const validate = ajv.compile(schema)

const isValid = (config: BookcaseBuilderConfig) => {
  const valid = validate(config)

  return {
    valid,
    errors: validate.errors,
  }
}
export function validateConfigs(packagesInfo: Array<PackageInfo>) {
  return packagesInfo.every(({ bookcaseBuilderConfig: config, packagePath: path }) => {
    if (!config)
      return true

    const { valid, errors } = isValid(config)
    if (!valid) {
      for (let i = 0; i < errors!.length; i++) {
        const err = errors![i]
        const log = (msg: string) => logError(`${msg} Please check ${join(path, 'package.json')}`)
        switch (err.keyword) {
          case 'additionalProperties':
            log(`Field '${err!.params!.additionalProperty}' is invalid.`)
            break
          case 'type': {
            const fieldsPath = String(err!.instancePath || '').slice(1).replaceAll('/', '.')
            log(`Field '${fieldsPath}' is invalid.`)
            break
          }
        }
      }
    }

    return valid
  })
}
