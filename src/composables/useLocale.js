import { ref, computed, provide } from 'vue'

export function useLocale() {
  const locale = ref('zh') // 預設中文
  
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

  const toggleLanguage = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
  }

  // 提供 locale 給子層元件使用
  provide('locale', locale)

  return {
    locale,
    t,
    dict,
    toggleLanguage
  }
}
