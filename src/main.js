import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// 🌟 1. 引入 AOS 與其 CSS 樣式檔案
import AOS from 'aos'
import 'aos/dist/aos.css'


const app = createApp(App)
app.use(router)
app.mount('#app')

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 🌟 2. 初始化 AOS 設定
if (!prefersReducedMotion) {
  AOS.init({
    duration: 680, // 降低動畫時間，減少感知延遲
    once: true,
    offset: 80,
    easing: 'ease-out-cubic'
  })
}
