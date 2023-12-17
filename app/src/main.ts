import 'element-plus/theme-chalk/dark/css-vars.css'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

registerSW({
  onNeedRefresh() {
    import('./lib/swHandler').then(({ onNeedRefresh }) => {
      onNeedRefresh()
    })
  },
  onOfflineReady() {
    import('./lib/swHandler').then(({ onOfflineReady }) => {
      onOfflineReady()
    })
  },
})
