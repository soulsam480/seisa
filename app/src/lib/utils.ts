import { camel, title } from 'radash'

export function sentence(str: string) {
  return title(camel(str))
}

export function preventSubmit(e: SubmitEvent) {
  e.preventDefault()
  e.stopPropagation()
}

export const TODAY = new Date()
