import { useMediaQuery } from '@vueuse/core'

export function useIsLargeScreen() {
  return useMediaQuery('(min-width: 640px)')
}
