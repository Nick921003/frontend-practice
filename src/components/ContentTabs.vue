<template>
  <section class="tab-section">
    <h2 class="section-title heading-2">{{ currentTab === 'portfolio' ? t.portfolioTitle : t.experienceTitle }}</h2>
    <div v-if="displayItems.length === 0" class="loading-text">{{ t.loading }}</div>
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

const { portfolioItems, experienceItems, fetchPublicProjects } = usePortfolioService()
const { t } = useLocale()

// 在組件掛載時獲取數據
onMounted(() => {
  fetchPublicProjects()
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
</style>
