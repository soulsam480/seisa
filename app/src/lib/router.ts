import { useBrowserLocation, useStorage } from '@vueuse/core'
import { computed, watch, watchEffect } from 'vue'

export type TPage = 'home' | 'settings' | 'spend'

export const ALLOWED_HASH: TPage[] = ['home', 'spend', 'settings']

export function useRouter() {
  const location = useBrowserLocation()

  const cachedPage = useStorage<TPage>('__s_page', 'home')

  // 1. compute the current page
  /**
   * Current page
   */
  const page = computed<TPage>(() => {
    const hash = location.value.hash ?? ''

    if (hash.length === 0)
      return cachedPage.value

    const value = hash.replace('#', '') as TPage

    if (!ALLOWED_HASH.includes(value))
      return cachedPage.value

    return value
  })

  // 1. keep the hash in sync with the page. when hash is invalid set it to home
  watchEffect(() => {
    const pageToSet = cachedPage.value.length > 0
      ? `#${cachedPage.value}`
      : (location.value.hash ?? '').length === 0
          ? '#home'
          : ''

    if (pageToSet.length === 0)
      return

    location.value.hash = pageToSet
  })

  // 3. keep the cached page in sync with the current page
  watch(() => page.value, (value) => {
    cachedPage.value = value
  })

  return {
    page,
    /**
     * Go to a page
     */
    goto(page: TPage) {
      location.value.hash = `#${page}`
    },
  }
}
