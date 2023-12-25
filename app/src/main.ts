import 'element-plus/theme-chalk/dark/css-vars.css'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { onNeedRefresh, onOfflineReady } from './lib/swHandler'

createApp(App).mount('#app')

const refresh = registerSW({
  onOfflineReady,
  onNeedRefresh() {
    onNeedRefresh(refresh)
  },
})
