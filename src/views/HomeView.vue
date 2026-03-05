<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">彭俊瑋 Chun-Wei Peng</div>
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

          <router-link to="/admin" class="admin-link">⚙️後台</router-link>
        </div>
      </div>
    </nav>

    <main class="content-container">
      <transition name="fade" mode="out-in">
        
        <section v-if="currentTab === 'about'" class="tab-section about-section">
          <div class="about-grid">
            <div class="about-text">
              <h1>Hello, 我是彭俊瑋 👋</h1>
              <h2 class="typing-container">
                I'm an <span class="typing-text">{{ typeValue }}</span><span class="cursor" :class="{'typing': typeStatus}">|</span>
              </h2>
              <div class="about-content">
                <p>目前就讀於中原大學電機工程學系四年級。</p>
                <p>相比於純粹的理論學習，我更著迷於「親自動手實作」的過程。從邊緣運算設備（如 NVIDIA Jetson Nano）的底層硬體組裝，到雲端架構（AWS, Docker）的系統部署，我喜歡將零散的技術元件，拼湊成能夠真正解決現實問題的自動化系統。</p>
                <p>我相信，一名優秀的工程師不僅要懂理論，更要有從無到有「造物（Monozukuri）」的執行力。期待能持續在機器學習與系統架構領域深耕，用技術創造價值。</p>
              </div>
            </div>
            
            <div class="about-image-wrapper">
              <img :src="getImageUrl('/images/profile.webp')" alt="彭俊瑋的個人照" class="profile-image" />
              <div class="image-backdrop"></div>
            </div>
          </div>
        </section>

        <section v-else-if="currentTab === 'portfolio'" class="tab-section">
          <h2 class="section-title">作品集</h2>
          <div v-if="portfolioItems.length === 0" class="loading-text">資料載入中或尚無資料...</div>
          <ProjectCard 
            v-else
            v-for="item in portfolioItems" 
            :key="item.id" 
            :project="item" 
          />
        </section>

        <section v-else-if="currentTab === 'experience'" class="tab-section">
          <h2 class="section-title">實習與課外經歷</h2>
          <div v-if="experienceItems.length === 0" class="loading-text">資料載入中或尚無資料...</div>
          <ProjectCard 
            v-else
            v-for="item in experienceItems" 
            :key="item.id" 
            :project="item" 
          />
        </section>

      </transition>
    </main>
    
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import FooterComponent from '../components/Footer.vue'
import { getImageUrl } from '../utils.js' // 引入我們升級過的工具函數

// 🌟 核心升級：引入 Supabase 連線 🌟
import { supabase } from '../supabase'

const currentTab = ref('about')

// 將原本寫死的 JSON 改為空的響應式陣列
const portfolioData = ref([])

// 🌟 從 Supabase 獲取真實資料的非同步函數
const fetchPublicProjects = async () => {
  if (!supabase) {
    console.warn('Supabase 未設定，略過遠端資料讀取。')
    return
  }

  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false }) // 最新發布的在最上面
    
    if (error) throw error
    
    // 將抓下來的資料放進變數中，Vue 會自動幫我們更新畫面
    if (data) {
      portfolioData.value = data
    }
  } catch (error) {
    console.error('獲取作品集資料失敗:', error)
  }
}

// 🌟 自動分類邏輯 (依賴響應式 portfolioData，自動計算)
const portfolioItems = computed(() => {
  return portfolioData.value.filter(item => item.category === 'Graduation Project')
})

const experienceItems = computed(() => {
  return portfolioData.value.filter(item => item.category !== 'Graduation Project')
})

// --- 動態打字效果邏輯 (保留原樣) ---
const typeValue = ref('')
const typeStatus = ref(false)
const displayTextArray = ['EE Student @ CYCU', 'Hardware-Software Integrator', 'Passionate Maker']
const typingSpeed = 100
const erasingSpeed = 50
const newTextDelay = 2000
let displayTextArrayIndex = 0
let charIndex = 0
let typeInterval = null

const typeText = () => {
  if (charIndex < displayTextArray[displayTextArrayIndex].length) {
    if (!typeStatus.value) typeStatus.value = true
    typeValue.value += displayTextArray[displayTextArrayIndex].charAt(charIndex)
    charIndex += 1
    typeInterval = setTimeout(typeText, typingSpeed)
  } else {
    typeStatus.value = false
    typeInterval = setTimeout(eraseText, newTextDelay)
  }
}

const eraseText = () => {
  if (charIndex > 0) {
    if (!typeStatus.value) typeStatus.value = true
    typeValue.value = displayTextArray[displayTextArrayIndex].substring(0, charIndex - 1)
    charIndex -= 1
    typeInterval = setTimeout(eraseText, erasingSpeed)
  } else {
    typeStatus.value = false
    displayTextArrayIndex += 1
    if (displayTextArrayIndex >= displayTextArray.length) displayTextArrayIndex = 0
    typeInterval = setTimeout(typeText, typingSpeed + 1000)
  }
}

onMounted(() => {
  fetchPublicProjects() // 🌟 網頁載入時，立刻去雲端抓資料
  typeInterval = setTimeout(typeText, 500)
})

onUnmounted(() => {
  clearTimeout(typeInterval)
})
</script>

<style>
/* --- 全局基礎設定 --- */
:root {
  --primary-color: #3b82f6; 
  --bg-color: #f8fafc; 
  --text-main: #0f172a; 
  --text-muted: #475569;
  --nav-bg: rgba(255, 255, 255, 0.85); 
  --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  font-family: 'Poppins', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

/* --- Navbar --- */
.navbar {
  position: fixed;
  top: 0;
  left: 0; 
  width: 100%;
  background-color: var(--nav-bg);
  backdrop-filter: blur(12px); 
  border-bottom: 1px solid rgba(0,0,0,0.06); 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  z-index: 100; 
}

.nav-container {
  max-width: 1000px; 
  margin: 0 auto;
  padding: 18px 25px; 
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4em; 
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.5px; 
}

.nav-links {
  display: flex;
  gap: 10px; 
}

/* 🌟 讓 button 與 router-link 完美共用樣式與對齊 🌟 */
.nav-links button,
.nav-links .admin-link {
  background: none;
  border: none;
  font-size: 1em;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
  text-decoration: none; 
  display: inline-flex;  
  align-items: center;
}

.nav-links button:hover,
.nav-links .admin-link:hover {
  color: var(--primary-color);
  background-color: #eff6ff;
}

.nav-links button.active {
  color: #fff;
  background-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); 
}

/* --- 主內容區 --- */
.content-container {
  max-width: 1000px;
  margin: 120px auto 40px; 
  padding: 0 20px;
  min-height: calc(100vh - 300px); 
}

.section-title {
  font-size: 2.2em;
  font-weight: 800;
  margin-bottom: 35px;
  color: var(--text-main);
  border-left: 6px solid var(--primary-color); 
  padding-left: 15px;
}

.loading-text {
  text-align: center;
  color: #64748b;
  font-size: 1.1em;
  padding: 40px 0;
}

/* --- 自我介紹排版 (Grid 雙欄) --- */
.about-section {
  padding: 50px;
  background: #fff;
  border-radius: 20px; 
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(0,0,0,0.03);
}

.about-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
  align-items: center;
}

.about-text {
  text-align: left;
}

.about-text h1 {
  font-size: 2.8em;
  margin: 0 0 5px 0;
  letter-spacing: -1px;
}

/* 動態打字游標特效 */
.typing-container {
  font-size: 1.4em;
  color: var(--primary-color);
  margin: 0 0 30px 0;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  height: 30px; 
}

.typing-text {
  color: var(--primary-color);
}

.cursor {
  display: inline-block;
  margin-left: 3px;
  width: 3px;
  background-color: var(--primary-color);
  color: transparent;
  animation: blink 1s infinite;
}
.cursor.typing {
  animation: none;
}

@keyframes blink {
  0%  { background-color: var(--primary-color); }
  49% { background-color: var(--primary-color); }
  50% { background-color: transparent; }
  99% { background-color: transparent; }
  100% { background-color: var(--primary-color); }
}

.about-content p {
  line-height: 1.85;
  font-size: 1.1em;
  color: var(--text-muted);
  margin-bottom: 22px;
}

/* 照片區塊設計 */
.about-image-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.profile-image {
  width: 100%;
  max-width: 300px;
  border-radius: 20px;
  object-fit: cover;
  z-index: 2;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  filter: contrast(1.05) saturate(1.05); 
}

/* 照片背後的裝飾色塊 */
.image-backdrop {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 100%;
  max-width: 300px;
  height: 100%;
  background-color: #dbeafe; 
  border-radius: 20px;
  z-index: 1;
}

/* --- 切換動畫 --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from { opacity: 0; transform: translateY(12px); }
.fade-leave-to { opacity: 0; transform: translateY(-12px); }

/* --- 手機版適配 (RWD) --- */
@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .about-image-wrapper {
    order: -1; 
    margin-bottom: 20px;
  }
  
  .profile-image, .image-backdrop {
    max-width: 250px;
  }
}

@media (max-width: 600px) {
  .nav-container {
    flex-direction: column;
    padding: 15px 15px;
    gap: 12px;
  }
  .nav-links button, .nav-links .admin-link {
    font-size: 0.9em;
    padding: 8px 12px;
  }
  .content-container { margin-top: 160px; }
  .about-section { padding: 25px; }
  .about-text h1 { font-size: 2.2em; }
  .typing-container { font-size: 1.1em; }
}
</style>