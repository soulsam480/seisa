/* eslint-disable no-console */

export const logger = {
  info(...args: any[]) {
    console.info('[SEISA INFO]: ', ...args)
  },
  warn(...args: any[]) {
    console.warn('[SEISA WARN]: ', ...args)
  },
  error(...args: any[]) {
    console.error('[SEISA ERROR]: ', ...args)
  },
}
