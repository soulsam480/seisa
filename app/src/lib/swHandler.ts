import { ElNotification } from 'element-plus'
import { h } from 'vue'
import ReloadPrompt from '../components/app/ReloadPrompt.vue'

export function onOfflineReady() {
  ElNotification.info({
    position: 'bottom-right',
    message: 'Updated to latest release. Ready to work offline.',
  })
}

export function onNeedRefresh(onReload: () => Promise<void>) {
  ElNotification({
    position: 'bottom-right',
    duration: 0,
    showClose: false,
    message: h(ReloadPrompt, {
      onReload,
    }),
  })
}
