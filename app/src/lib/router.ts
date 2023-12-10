import { useBrowserLocation } from '@vueuse/core'
import { computed, watchEffect } from 'vue'

export type TPage = 'home' | 'settings' | 'spend'

export const ALLOWED_HASH: TPage[] = ['home', 'spend', 'settings']

export function useRouter() {
  const location = useBrowserLocation()

  const page = computed<TPage>(() => {
    const hash = location.value.hash ?? ''

    if (hash.length === 0)
      return 'home'

    const value = hash.replace('#', '') as TPage

    if (!ALLOWED_HASH.includes(value))
      return 'home'

    return value
  })

  watchEffect(() => {
    if ((location.value.hash ?? '').length === 0)
      location.value.hash = '#home'
  })

  return {
    page,
    goto(page: TPage) {
      location.value.hash = `#${page}`
    },
  }
}
