<template>
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
            :class="['btn', activeTab === 'about' ? 'btn-primary' : 'btn-ghost', 'nav-btn']"
            @click="handleSelectTab('about')"
          >{{ t.about }}</button>
          
          <button 
            :class="['btn', activeTab === 'portfolio' ? 'btn-primary' : 'btn-ghost', 'nav-btn']"
            @click="handleSelectTab('portfolio')"
          >{{ t.portfolio }}</button>
          
          <button 
            :class="['btn', activeTab === 'experience' ? 'btn-primary' : 'btn-ghost', 'nav-btn']"
            @click="handleSelectTab('experience')"
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
</template>

<script setup>
import { computed } from 'vue'
import { useNavigation } from '../composables/useNavigation'
import { useLocale } from '../composables/useLocale'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'about'
  }
})

const emit = defineEmits(['select-tab'])

const {
  isNavExpanded,
  isNavPinned,
  isMobileMode,
  canHover,
  isNavHidden,
  isNavOpen,
  handleNavMouseEnter,
  handleNavMouseLeave,
  toggleNavOnClick
} = useNavigation()

const { t, toggleLanguage } = useLocale()

const handleSelectTab = (tab) => {
  emit('select-tab', tab)
  
  // 手機版選擇後收合導航欄
  if (isMobileMode.value) {
    isNavExpanded.value = false
    return
  }

  // 桌機版如果沒有釘住，也收合
  if (!isNavPinned.value) {
    isNavExpanded.value = false
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 18px;
  z-index: 100;
  width: min(1080px, calc(100% - 30px));
  margin: 0 auto;
  padding-bottom: 20px;
  transition: transform 0.3s var(--ease-standard);
}

.navbar.is-hidden {
  transform: translateY(-100%);
}

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
  max-height: 58px;
  transition: max-height 0.4s var(--ease-standard), background-color var(--duration-base) ease;
}

.nav-container.is-expanded {
  max-height: 300px;
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
}

@media (max-width: 620px) {
  .navbar {
    top: 10px;
    width: calc(100% - 20px);
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
