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
                <p>我相信，一名優秀的工程師不僅要懂理論，更要有從無到有的執行力。期待能持續在機器學習與系統架構領域深耕，用技術創造價值。</p>
              </div>

              <div class="skills-showcase">
                <h3 class="skills-title">Technical Skills</h3>
                <div class="skills-group">
                  <span class="group-label">語言與框架</span>
                  <div class="skill-chips">
                    <span class="chip">Python</span>
                    <span class="chip">C</span>
                    <span class="chip">JavaScript</span>
                    <span class="chip">Vue.js</span>
                    <span class="chip">Django</span>
                  </div>
                </div>
                <div class="skills-group">
                  <span class="group-label">雲端與系統</span>
                  <div class="skill-chips">
                    <span class="chip">Docker</span>
                    <span class="chip">AWS</span>
                    <span class="chip">Celery</span>
                    <span class="chip">Redis</span>
                    <span class="chip">PostgreSQL</span>
                    <span class="chip">Supabase</span>
                  </div>
                </div>
                <div class="skills-group">
                  <span class="group-label">邊緣運算與硬體</span>
                  <div class="skill-chips">
                    <span class="chip">NVIDIA Jetson Nano</span>
                    <span class="chip">YOLOv11</span>
                    <span class="chip">Fusion 360</span>
                  </div>
                </div>
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
.layout {
  position: relative;
  min-height: 100vh;
}

.layout::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.2;
  background-image: linear-gradient(to right, rgba(70, 67, 52, 0.06) 1px, transparent 1px);
  background-size: 52px 100%;
}

.navbar {
  position: sticky;
  top: 18px;
  z-index: 100;
  width: min(1080px, calc(100% - 30px));
  margin: 0 auto;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 12px 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 253, 248, 0.82);
  box-shadow: 0 8px 22px rgba(72, 62, 42, 0.1);
}

.logo {
  font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--text-main);
  white-space: nowrap;
}

.nav-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-links button,
.nav-links .admin-link {
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 9px 15px;
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  background: transparent;
  transition: color 0.25s ease, background-color 0.25s ease, transform 0.25s ease;
}

.nav-links button:hover,
.nav-links .admin-link:hover {
  color: var(--primary-color);
  background: rgba(47, 93, 80, 0.1);
  transform: translateY(-1px);
}

.nav-links button.active {
  color: #f7f2e8;
  background-color: var(--primary-color);
}

.content-container {
  width: min(1080px, calc(100% - 34px));
  margin: 24px auto 40px;
  min-height: calc(100vh - 240px);
}

.tab-section {
  animation: sectionReveal 0.55s ease both;
}

@keyframes sectionReveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  margin: 0 0 22px;
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
  letter-spacing: 0.04em;
  color: var(--text-main);
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}

.loading-text {
  padding: 34px 0;
  text-align: center;
  color: var(--text-muted);
}

.about-section {
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: clamp(24px, 4vw, 48px);
  background: linear-gradient(145deg, rgba(255, 253, 248, 0.92), rgba(252, 247, 237, 0.78));
  box-shadow: var(--card-shadow);
}

.about-grid {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: clamp(24px, 3.2vw, 46px);
  align-items: center;
}

.about-text {
  text-align: left;
}

.about-text h1 {
  margin: 0 0 12px;
  font-size: clamp(2.1rem, 4.4vw, 3.25rem);
  line-height: 1.06;
  letter-spacing: 0.02em;
  font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
  font-weight: 700;
}

.typing-container {
  margin: 0 0 24px;
  min-height: 34px;
  font-size: clamp(1.08rem, 2.2vw, 1.32rem);
  color: var(--primary-color);
  font-weight: 600;
}

.typing-text {
  font-family: 'Manrope', sans-serif;
  letter-spacing: 0.04em;
}

.cursor {
  display: inline-block;
  width: 2px;
  margin-left: 3px;
  background: var(--primary-color);
  color: transparent;
  animation: blink 0.95s infinite;
}

.cursor.typing {
  animation: none;
}

@keyframes blink {
  0%,
  48% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.about-content p {
  margin: 0 0 18px;
  line-height: 1.95;
  color: var(--text-muted);
  font-size: 1.02rem;
}

.about-image-wrapper {
  position: relative;
  width: min(360px, 100%);
  margin-inline: auto;
}

.profile-image {
  width: 100%;
  display: block;
  position: relative;
  z-index: 2;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 24px 45px rgba(36, 42, 39, 0.2);
  transform: rotate(-1.4deg);
}

.image-backdrop {
  position: absolute;
  z-index: 1;
  inset: 14px -16px -14px 16px;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(47, 93, 80, 0.24), rgba(170, 131, 84, 0.3));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 920px) {
  .nav-container {
    border-radius: 24px;
    padding: 14px;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    justify-content: flex-start;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-image-wrapper {
    order: -1;
  }
}

.skills-showcase {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px dashed rgba(47, 93, 80, 0.2);
}

.skills-title {
  font-family: 'Manrope', sans-serif;
  font-size: 1.1rem;
  color: var(--text-main);
  margin: 0 0 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.skills-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background-color: var(--paper);
  border: 1px solid var(--line);
  color: var(--primary-color);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.chip:hover {
  background-color: rgba(47, 93, 80, 0.08);
  border-color: rgba(47, 93, 80, 0.35);
  box-shadow: 0 6px 14px rgba(47, 93, 80, 0.12);
  animation: chipBounce 0.35s ease;
}

@keyframes chipBounce {
  0% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  70% {
    transform: translateY(1px);
  }
  100% {
    transform: translateY(0);
  }
}

@media (max-width: 620px) {
  .navbar {
    top: 10px;
    width: calc(100% - 20px);
  }

  .content-container {
    width: calc(100% - 20px);
    margin-top: 16px;
  }

  .logo {
    font-size: 1.25rem;
  }

  .nav-links button,
  .nav-links .admin-link {
    font-size: 0.88rem;
    padding: 8px 12px;
  }
}
</style>