<template>
  <div class="layout">
    <nav 
      class="navbar"
      :class="{ 'is-hidden': isNavHidden }"
      @mouseenter="handleNavMouseEnter"
      @mouseleave="handleNavMouseLeave"
    >
      <div class="nav-container" :class="{ 'is-expanded': isNavOpen }">
        <div
          class="nav-header"
          role="button"
          tabindex="0"
          :aria-expanded="String(isNavOpen)"
          :aria-label="t.menu"
          @click="toggleNavOnClick"
          @keydown.enter.prevent="toggleNavOnClick"
          @keydown.space.prevent="toggleNavOnClick"
        >
          <div class="logo">彭俊瑋 Chun-Wei Peng</div>
          <div class="menu-indicator" v-show="isMobileMode || !isNavOpen">
            <span class="menu-icon">{{ isNavOpen ? '✕' : '☰' }}</span>
            {{ t.menu }}
          </div>
        </div>
        
        <div class="nav-links">
          <div class="nav-primary">
            <button 
              :class="['btn', currentTab === 'about' ? 'btn-primary' : 'btn-ghost', 'nav-btn']"
              @click="selectTab('about')"
            >{{ t.about }}</button>
            
            <button 
              :class="['btn', currentTab === 'portfolio' ? 'btn-primary' : 'btn-ghost', 'nav-btn']"
              @click="selectTab('portfolio')"
            >{{ t.portfolio }}</button>
            
            <button 
              :class="['btn', currentTab === 'experience' ? 'btn-primary' : 'btn-ghost', 'nav-btn']"
              @click="selectTab('experience')"
            >{{ t.experience }}</button>
          </div>

          <div class="nav-secondary">
            <button class="btn btn-ghost lang-toggle-btn" @click="toggleLanguage">
              🌐 {{ t.langBtn }}
            </button>
            <router-link to="/admin" class="btn btn-ghost admin-link">{{ t.admin }}</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="content-container">
      <transition name="fade" mode="out-in">
        
        <section v-if="currentTab === 'about'" class="tab-section about-section">
          <div class="about-grid">
            <div class="about-text">
              <h1 class="heading-1">{{ t.greeting }}</h1>
              <h2 class="typing-container">
                I'm an <span class="typing-text">{{ typeValue }}</span><span class="cursor" :class="{'typing': typeStatus}">|</span>
              </h2>
              <div class="about-content">
                <template v-if="locale === 'zh'">
                  <p>目前就讀於中原大學電機工程學系四年級。</p>
                  <p>相比於純粹的理論學習，我更著迷於「親自動手實作」的過程。從邊緣運算設備（如 NVIDIA Jetson Nano）的底層硬體組裝，到雲端架構（AWS, Docker）的系統部署，我喜歡將零散的技術元件，拼湊成能夠真正解決現實問題的自動化系統。</p>
                  <p>我相信，一名優秀的工程師不僅要懂理論，更要有從無到有的執行力。期待能持續在機器學習與系統架構領域深耕，用技術創造價值。</p>
                </template>
                <template v-else>
                  <p>I am currently a senior student majoring in Electrical Engineering at Chung Yuan Christian University.</p>
                  <p>Compared to purely theoretical studies, I am more fascinated by the process of "hands-on implementation." From assembling low-level hardware for edge computing devices (like NVIDIA Jetson Nano) to deploying system architectures on the cloud (AWS, Docker), I enjoy piecing together scattered technical components into automated systems that solve real-world problems.</p>
                  <p>I believe an excellent engineer must not only understand theories but also possess the execution ability to build from scratch. I look forward to continuing my deep dive into machine learning and system architecture, creating value through technology.</p>
                </template>
              </div>

              <div class="skills-showcase">
                <h3 class="skills-title heading-3">{{ t.techSkills }}</h3>
                <div class="skills-group">
                  <span class="group-label">{{ locale === 'zh' ? '語言與框架' : 'Languages & Frameworks' }}</span>
                  <div class="skill-chips">
                    <span class="chip">Python</span>
                    <span class="chip">C</span>
                    <span class="chip">JavaScript</span>
                    <span class="chip">Vue.js</span>
                    <span class="chip">Django</span>
                  </div>
                </div>
                <div class="skills-group">
                  <span class="group-label">{{ locale === 'zh' ? '雲端與系統' : 'Cloud & Systems' }}</span>
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
                  <span class="group-label">{{ locale === 'zh' ? '邊緣運算與硬體' : 'Edge Computing & Hardware' }}</span>
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
          <h2 class="section-title heading-2">{{ t.portfolioTitle }}</h2>
          <div v-if="portfolioItems.length === 0" class="loading-text">{{ t.loading }}</div>
          <ProjectCard 
            v-else
            v-for="item in portfolioItems" 
            :key="item.id" 
            :project="item" 
          />
        </section>

        <section v-else-if="currentTab === 'experience'" class="tab-section">
          <h2 class="section-title heading-2">{{ t.experienceTitle }}</h2>
          <div v-if="experienceItems.length === 0" class="loading-text">{{ t.loading }}</div>
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
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import FooterComponent from '../components/Footer.vue'
import { getImageUrl } from '../utils.js'
import { supabase } from '../supabase'

// --- 多語系 (i18n) 邏輯 ---
const locale = ref('zh') // 預設中文
const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

// 建立輕量級字典
const dict = {
  zh: {
    menu: '選單',
    about: '自我介紹',
    portfolio: '作品集',
    experience: '經歷',
    admin: '⚙️後台',
    langBtn: 'EN',
    greeting: 'Hello, 我是彭俊瑋 👋',
    portfolioTitle: '作品集',
    experienceTitle: '實習與課外經歷',
    loading: '資料載入中或尚無資料...',
    techSkills: 'Technical Skills'
  },
  en: {
    menu: 'Menu',
    about: 'About',
    portfolio: 'Portfolio',
    experience: 'Experience',
    admin: '⚙️Admin',
    langBtn: '中文',
    greeting: "Hello, I'm Chun-Wei Peng 👋",
    portfolioTitle: 'Portfolio',
    experienceTitle: 'Internships & Extracurriculars',
    loading: 'Loading or no data available...',
    techSkills: 'Technical Skills'
  }
}
const t = computed(() => dict[locale.value])

// 提供 locale 給子層元件 (例如 ProjectCard) 使用
provide('locale', locale)

// --- 導覽列收合邏輯 ---
const isNavExpanded = ref(false)
const isNavPinned = ref(false)
const isMobileMode = ref(false)
const canHover = ref(true)
const isNavOpen = computed(() => isNavExpanded.value || isNavPinned.value)
const isNavHidden = ref(false) // 滾動時隱藏導航欄

let mobileMediaQuery = null
let hoverMediaQuery = null

const updateInputMode = () => {
  if (!mobileMediaQuery || !hoverMediaQuery) return
  isMobileMode.value = mobileMediaQuery.matches
  canHover.value = hoverMediaQuery.matches

  // 手機版預設收合，改由點擊圖示展開
  if (isMobileMode.value) {
    isNavExpanded.value = false
    isNavPinned.value = false
    return
  }

  // 回到桌機時避免殘留手機展開狀態
  isNavExpanded.value = false
}

const handleNavMouseEnter = () => {
  if (isMobileMode.value || !canHover.value || isNavPinned.value) return
  isNavExpanded.value = true
}

const handleNavMouseLeave = () => {
  if (isMobileMode.value || !canHover.value || isNavPinned.value) return
  isNavExpanded.value = false
}

const toggleNavOnClick = () => {
  if (isMobileMode.value) {
    isNavExpanded.value = !isNavExpanded.value
    return
  }

  isNavPinned.value = !isNavPinned.value
  isNavExpanded.value = isNavPinned.value
}

const selectTab = (tab) => {
  currentTab.value = tab
  if (isMobileMode.value) {
    isNavExpanded.value = false
    return
  }

  if (!isNavPinned.value) {
    isNavExpanded.value = false
  }
}

const currentTab = ref('about')
const portfolioData = ref([])

const fetchPublicProjects = async () => {
  if (!supabase) return
  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data) portfolioData.value = data
  } catch (error) {
    console.error('獲取作品集資料失敗:', error)
  }
}

const portfolioItems = computed(() => {
  return portfolioData.value.filter(item => item.category === 'Graduation Project')
})

const experienceItems = computed(() => {
  return portfolioData.value.filter(item => item.category !== 'Graduation Project')
})

// --- 動態打字效果邏輯 ---
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
  mobileMediaQuery = window.matchMedia('(max-width: 920px)')
  hoverMediaQuery = window.matchMedia('(hover: hover)')
  updateInputMode()
  mobileMediaQuery.addEventListener('change', updateInputMode)
  hoverMediaQuery.addEventListener('change', updateInputMode)

  fetchPublicProjects()
  typeInterval = setTimeout(typeText, 500)

  // --- 滾動監聽邏輯 ---
  let lastScrollTop = 0
  const handleScroll = () => {
    if (!isMobileMode.value) return // 只在行動版本生效
    
    const currentScroll = window.scrollY || document.documentElement.scrollTop
    
    // 如果導航欄展開中，不要隱藏
    if (isNavExpanded.value) {
      isNavHidden.value = false
      lastScrollTop = currentScroll
      return
    }
    
    // 向下滑動時隱藏，向上滑動時顯示
    if (currentScroll > lastScrollTop) {
      isNavHidden.value = true
    } else {
      isNavHidden.value = false
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  if (mobileMediaQuery) {
    mobileMediaQuery.removeEventListener('change', updateInputMode)
  }

  if (hoverMediaQuery) {
    hoverMediaQuery.removeEventListener('change', updateInputMode)
  }

  window.removeEventListener('scroll', handleScroll)
  clearTimeout(typeInterval)
})
</script>

<style>
/* --- 保留原有的版面設定，修改導覽列區塊 --- */
.layout {
  position: relative;
  min-height: 100vh;
  scroll-padding-top: 110px; /* 為粘性導航欄預留空間 */
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
  padding-bottom: 20px; /* 增加透明感應區，避免滑鼠一離開就立刻收起 */
  transition: transform 0.3s var(--ease-standard);
}

.navbar.is-hidden {
  transform: translateY(-100%);
}

/* --- 動態展開/收合的核心 --- */
.nav-container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  backdrop-filter: blur(10px);
  background: var(--surface-1);
  box-shadow: 0 8px 22px rgba(72, 62, 42, 0.1);
  overflow: hidden;
  max-height: 58px; /* 收合時的高度 */
  transition: max-height 0.4s var(--ease-standard), background-color var(--duration-base) ease;
}

.nav-container.is-expanded {
  max-height: 300px; /* 展開時的高度限制 */
  background: var(--surface-2);
  box-shadow: 0 12px 28px rgba(72, 62, 42, 0.15);
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 34px;
  border-radius: 12px;
  cursor: pointer;
}

.nav-header:focus-visible {
  outline: 2px solid rgba(47, 93, 80, 0.45);
  outline-offset: 4px;
}

.menu-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--primary-color);
  font-size: var(--text-sm);
  font-weight: 700;
  opacity: 0.8;
  padding-right: var(--space-2);
  transition: opacity var(--duration-fast) ease;
}

.menu-icon {
  width: 16px;
  text-align: center;
}

.logo {
  font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--text-main);
  white-space: nowrap;
}

.nav-container.is-expanded .nav-header:focus-visible {
  outline: none;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-4);
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity var(--duration-base) ease 0.1s, transform var(--duration-base) ease 0.1s;
  pointer-events: none;
}

.nav-primary,
.nav-secondary {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.nav-container.is-expanded .nav-links {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.nav-links .btn {
  border-color: transparent;
}

.nav-links .btn-ghost {
  border-color: transparent;
}

/* 語言切換按鈕特效 */
.lang-toggle-btn {
  background: rgba(215, 228, 223, 0.4) !important;
  color: var(--primary-color) !important;
  border: 1px solid rgba(47, 93, 80, 0.2) !important;
}
.lang-toggle-btn:hover {
  background: var(--primary-color) !important;
  color: #fff !important;
}

@media (min-width: 921px) {
  .nav-links {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .nav-primary {
    flex: 1;
    justify-content: center;
  }

  .nav-secondary {
    flex: 0 0 auto;
    margin-left: 8px;
  }
}

.content-container {
  width: min(1080px, calc(100% - 34px));
  margin: 24px auto 40px;
  min-height: calc(100vh - 240px);
}

/* 以下皆為原廠設定，保持不變 */
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
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}

.loading-text {
  padding: 34px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-md);
}

.about-section {
  border: var(--card-border);
  border-radius: var(--radius-xl);
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

.typing-container {
  margin: 0 0 24px;
  min-height: 34px;
  font-size: var(--text-xl);
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
  max-width: 65ch;
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

.skills-showcase {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px dashed rgba(47, 93, 80, 0.2);
}
.skills-title {
  font-family: 'Manrope', sans-serif;
  font-size: var(--text-lg);
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
  font-size: var(--text-xs);
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
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: background-color var(--duration-fast) ease, border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
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

@media (max-width: 920px) {
  .nav-container {
    border-radius: 24px;
    padding: 14px;
    flex-direction: column;
    align-items: flex-start;
    max-height: 62px;
  }

  .nav-container.is-expanded {
    max-height: 320px;
  }

  .nav-header {
    cursor: pointer;
  }

  .menu-indicator {
    display: inline-flex;
  }

  .nav-links {
    width: 100%;
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    margin-top: 12px;
  }

  .nav-primary {
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .nav-primary::-webkit-scrollbar {
    display: none;
  }

  .nav-primary .btn {
    flex: 0 0 auto;
  }

  .nav-secondary {
    width: 100%;
  }

  .nav-container.is-expanded .nav-links {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-image-wrapper {
    order: -1;
  }
}

@media (max-width: 620px) {
  .layout {
    scroll-padding-top: 90px; /* 行動裝置上調整為較小值 */
  }

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

  .nav-links .btn {
    font-size: 0.88rem;
    padding: 8px 12px;
  }
}
</style>