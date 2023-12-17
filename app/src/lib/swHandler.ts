import { ElNotification } from 'element-plus'

export function onNeedRefresh() {
  ElNotification.info({
    position: 'bottom-right',
    title: 'Update available. Refresh to update',
    message: 'Please save your work before refreshing',
    showClose: false,
    duration: 0,
  })
}

export function onOfflineReady() {
  ElNotification.info({
    position: 'bottom-right',
    title: 'Updated app to latest release !',
  })
}
