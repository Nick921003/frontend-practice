<template>
  <div class="layout">
    <Navbar 
      :activeTab="currentTab"
      @select-tab="selectTab"
    />

    <main class="content-container">
      <transition name="fade" mode="out-in">
        <AboutSection v-if="currentTab === 'about'" />
        <ContentTabs v-else :currentTab="currentTab" />
      </transition>
    </main>
    
    <FooterComponent />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import AboutSection from '../components/AboutSection.vue'
import ContentTabs from '../components/ContentTabs.vue'
import FooterComponent from '../components/Footer.vue'
import { useLocale } from '../composables/useLocale'
import { useTabNavigation } from '../composables/useTabNavigation'
import { useNavigation } from '../composables/useNavigation'

// 初始化多語言系統
const { locale } = useLocale()

// 初始化導航欄邏輯
const { isNavExpanded, isNavPinned, isMobileMode } = useNavigation()

// 初始化標籤頁邏輯
const { currentTab, selectTab: updateTab } = useTabNavigation()

// 包裝 selectTab 以同時更新導航欄狀態
const selectTab = (tab) => {
  updateTab(tab)
  
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

<style>
.layout {
  position: relative;
  min-height: 100vh;
  scroll-padding-top: 110px;
  animation: pageReveal 0.6s ease both;
}

.layout::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.15;
  background-image: linear-gradient(to right, rgba(24, 24, 27, 0.05) 1px, transparent 1px);
  background-size: 52px 100%;
}

.layout::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 15% 16%, rgba(146, 64, 14, 0.06), transparent 33%),
    radial-gradient(circle at 85% 9%, rgba(24, 24, 27, 0.04), transparent 29%);
}

.content-container {
  width: min(1120px, calc(100% - 34px));
  margin: 48px auto 64px;
  min-height: calc(100vh - 240px);
}

@keyframes pageReveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@media (max-width: 620px) {
  .layout {
    scroll-padding-top: 90px;
  }

  .content-container {
    width: calc(100% - 20px);
    margin-top: 16px;
    margin-bottom: 38px;
  }
}
</style>