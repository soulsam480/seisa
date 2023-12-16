import 'element-plus/theme-chalk/dark/css-vars.css'
import { registerSW } from 'virtual:pwa-register'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

registerSW({
  immediate: true,
  onOfflineReady() {
    import('element-plus').then(({ ElNotification }) => {
      ElNotification.info({
        position: 'bottom-right',
        title: 'Updated app to latest release !',
      })
    })
  },
})
