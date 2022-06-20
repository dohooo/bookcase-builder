import chalk from 'chalk'

export const prefix = '[bookcase-builder] '

// eslint-disable-next-line no-console
const log = (...args: string[]) => console.log(prefix, ...args)

export const chalkSuccess = chalk.green
export const chalkError = chalk.red
export const chalkWarning = chalk.yellow

export function logError(message: string) {
  log(chalkError(message))
}

export function logWarning(message: string) {
  log(chalkWarning(message))
}

export function logNormal(...message: string[]) {
  log(...message)
}

export function logSuccess(message: string) {
  log(chalkSuccess(message))
}
