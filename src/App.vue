<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">彭俊瑋的履歷網站</div>
        <div class="nav-links">
          <button 
            :class="{ active: currentTab === 'about' }" 
            @click="currentTab = 'about'"
          >自我介紹</button>
          
          <button 
            :class="{ active: currentTab === 'portfolio' }" 
            @click="currentTab = 'portfolio'"
          >作品集</button>
          
          <button 
            :class="{ active: currentTab === 'experience' }" 
            @click="currentTab = 'experience'"
          >經歷</button>
        </div>
      </div>
    </nav>

    <main class="content-container">
      
      <transition name="fade" mode="out-in">
        <section v-if="currentTab === 'about'" class="tab-section about-section">
          <h1>Hello, 我是彭俊瑋 👋</h1>
          <h2>熱衷於軟硬體整合的電機工程師</h2>
          <div class="about-content">
            <p>目前就讀於中原大學電機工程學系四年級。</p>
            <p>相比於純粹的理論學習，我更著迷於「親自動手實作」的過程。從邊緣運算設備（如 NVIDIA Jetson Nano）的底層硬體組裝，到雲端架構（AWS, Docker）的系統部署，我喜歡將零散的技術元件，拼湊成能夠真正解決現實問題的自動化系統。</p>
            <p>我相信，一名優秀的工程師不僅要懂理論，更要有從無到有「造物（Monozukuri）」的執行力。期待能持續在機器學習與系統架構領域深耕，用技術創造價值。</p>
          </div>
        </section>

      <section v-else-if="currentTab === 'portfolio'" class="tab-section">
          <h2 class="section-title">作品集</h2>
          <ProjectCard 
            v-for="item in portfolioItems" 
            :key="item.id" 
            :project="item" 
          />
        </section>

      <section v-else-if="currentTab === 'experience'" class="tab-section">
          <h2 class="section-title">實習與課外經歷</h2>
          <ProjectCard 
            v-for="item in experienceItems" 
            :key="item.id" 
            :project="item" 
          />
        </section>
      </transition>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProjectCard from './components/ProjectCard.vue'
import portfolioData from './data/portfolio.json'

// 🌟 狀態管理：預設顯示「自我介紹」
const currentTab = ref('about')

// 🌟 資料過濾邏輯 (Computed)
// 作品集：過濾出 category 為 'Graduation Project' 的資料
const portfolioItems = computed(() => {
  return portfolioData.filter(item => item.category === 'Graduation Project')
})

// 經歷：過濾出 category 不是 'Graduation Project' 的資料
const experienceItems = computed(() => {
  return portfolioData.filter(item => item.category !== 'Graduation Project')
})
</script>

<style>
/* --- 全局基礎設定 --- */
:root {
  --primary-color: #3b82f6; /* 科技藍 */
  --bg-color: #f1f5f9; /* 稍微加深背景色，與白色卡片形成對比 */
  --text-main: #0f172a; /* 接近純黑的深藍色 */
  --text-muted: #475569;
  --nav-bg: rgba(255, 255, 255, 0.95); /* 提高透明度，看起來更實心 */
  --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

/* --- 🌟 導覽列重塑 (Redesign for Completeness) --- */
.navbar {
  position: fixed;
  top: 0;
  left: 0; /* 確保全寬 */
  width: 100%;
  background-color: var(--nav-bg);
  backdrop-filter: blur(12px); /* 增強毛玻璃 */
  /* 🌟 加入明確的底部邊界與精緻雙層陰影，營造 grounded (落地) 感 */
  border-bottom: 1px solid rgba(0,0,0,0.06); 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  z-index: 100; /* 導覽列層級低於 Lightbox */
}

.nav-container {
  max-width: 1000px; /* 稍微加寬，看起來更大氣 */
  margin: 0 auto;
  padding: 18px 25px; /* 增加內距，讓標題不擁擠 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.4em; /* 放大標題 */
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -1px; /* 緊湊字體，更有設計感 */
}

.nav-links {
  display: flex;
  gap: 10px; /* 使用 gap 代替 margin-left，排版更優雅 */
}

.nav-links button {
  background: none;
  border: none;
  font-size: 1em;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-links button:hover {
  color: var(--primary-color);
  background-color: #eff6ff;
}

.nav-links button.active {
  color: #fff;
  background-color: var(--primary-color);
  /* 加入微小的按鈕陰影 */
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); 
}

/* --- 主內容區修復 --- */
.content-container {
  max-width: 900px;
  margin: 120px auto 60px; /* 增加頂部留白，避開新的 navbar */
  padding: 0 20px;
}

.section-title {
  font-size: 2.2em;
  font-weight: 800;
  margin-bottom: 35px;
  color: var(--text-main);
  border-left: 6px solid var(--primary-color); /* 改用左側邊界，看起來更簡潔 */
  padding-left: 15px;
}

/* --- 自我介紹排版 (保留並優化) --- */
.about-section {
  text-align: left;
  padding: 45px;
  background: #fff;
  border-radius: 16px; /* 更圓潤 */
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(0,0,0,0.03);
}

.about-section h1 {
  font-size: 2.8em;
  margin: 0 0 12px 0;
  letter-spacing: -1.5px;
}

.about-section h2 {
  font-size: 1.3em;
  color: var(--primary-color);
  margin: 0 0 35px 0;
  font-weight: 600;
}

.about-content p {
  line-height: 1.85;
  font-size: 1.15em;
  color: var(--text-muted);
  margin-bottom: 22px;
}

/* --- 切換動畫 --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* --- 手機版適配 (RWD) 修復 --- */
@media (max-width: 600px) {
  .nav-container {
    flex-direction: column;
    padding: 15px 15px;
    gap: 12px;
  }
  .nav-links button {
    font-size: 0.9em;
    padding: 8px 12px;
  }
  .content-container {
    margin-top: 160px; /* 手機版導覽列變高，需調整內容留白 */
  }
  .about-section {
    padding: 25px;
  }
}
</style>