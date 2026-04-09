<template>
  <section class="tab-section">
    <h2 class="section-title heading-2">{{ currentTab === 'portfolio' ? t.portfolioTitle : t.experienceTitle }}</h2>
    <div v-if="isLoading" class="loading-text">{{ t.loading }}</div>
    <div v-else-if="hasFetched && displayItems.length === 0" class="loading-text">目前尚無可顯示資料</div>
    <ProjectCard 
      v-else
      v-for="item in displayItems" 
      :key="item.id" 
      :project="item" 
    />
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ProjectCard from './ProjectCard.vue'
import { usePortfolioService } from '../services/portfolioService'
import { useLocale } from '../composables/useLocale'

const props = defineProps({
  currentTab: {
    type: String,
    required: true
  }
})

const { portfolioItems, experienceItems, isLoading, hasFetched, fetchPublicProjects } = usePortfolioService()
const { t } = useLocale()

// 在組件掛載時獲取數據
onMounted(() => {
  if (!hasFetched.value) {
    fetchPublicProjects()
  }
})

const displayItems = computed(() => {
  if (props.currentTab === 'portfolio') {
    return portfolioItems.value
  } else if (props.currentTab === 'experience') {
    return experienceItems.value
  }
  return []
})
</script>

<style scoped>
.tab-section {
  animation: sectionReveal 0.55s ease both;
  border: 1px solid rgba(228, 228, 231, 0.85);
  border-radius: var(--radius-xl);
  padding: clamp(22px, 3.2vw, 42px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(250, 250, 251, 0.82));
  box-shadow: var(--card-shadow);
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
  margin: 0 0 26px;
  letter-spacing: 0.04em;
  border-bottom: 1px solid rgba(214, 204, 186, 0.9);
  padding-bottom: 14px;
}

.loading-text {
  padding: 40px 0;
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-md);
}

.tab-section :deep(.card) {
  opacity: 0;
  animation: cardRise 0.5s ease forwards;
}

.tab-section :deep(.card:nth-of-type(2)) {
  animation-delay: 70ms;
}

.tab-section :deep(.card:nth-of-type(3)) {
  animation-delay: 140ms;
}

.tab-section :deep(.card:nth-of-type(4)) {
  animation-delay: 210ms;
}

@keyframes cardRise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 620px) {
  .tab-section {
    padding: 18px;
  }

  .section-title {
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
}
</style>
