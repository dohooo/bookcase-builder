import { cwd } from 'process'
import { getBookcaseBuilderBConfig } from './get-bookcase-builder-config'
import type { BookcaseBuilderConfig } from './types'

export const GLOBAL_CONFIG: Partial<BookcaseBuilderConfig> = getBookcaseBuilderBConfig(cwd()) || {}
