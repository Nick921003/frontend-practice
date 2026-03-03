import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 🌟 1. 引入 AOS 與其 CSS 樣式檔案
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

// 🌟 2. 初始化 AOS 設定
AOS.init({
  duration: 800, // 動畫持續時間 (0.8秒，這樣看起來比較優雅不突兀)
  once: true,    // 是否只執行動畫一次 (往回滾動時不會重複觸發，比較不暈)
  offset: 100,   // 距離觸發點 100px 時開始執行
  easing: 'ease-out-cubic' // 讓動畫結尾有平滑減速的感覺
})

app.mount('#app')