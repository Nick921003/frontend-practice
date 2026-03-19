<template>
  <div class="card" data-aos="fade-up">
    <div class="card-header">
      <span class="category">{{ project.category }}</span>
      <span class="period">
        <Calendar class="icon-inline" :size="16" />
        {{ project.period }}
      </span>
    </div>
    <h2 class="card-title heading-3">{{ project.title }}</h2>
    <p class="role">
      <User class="icon-inline" :size="18" />
      擔任角色：{{ project.role }}
    </p>
    
    <p class="short-description">{{ project.short_description }}</p>
    
    <div class="description-wrapper" :class="{ 'is-expanded': isExpanded }">
      <p class="description" v-html="formattedDetails"></p>
      <div v-if="!isExpanded" class="fade-overlay"></div>
    </div>

    <button class="btn btn-ghost expand-btn" @click="toggleExpand" aria-label="切換顯示完整內容">
      {{ isExpanded ? '收起完整細節' : '閱讀完整細節' }}
      <ChevronUp v-if="isExpanded" class="icon-inline ms-1" :size="16" />
      <ChevronDown v-else class="icon-inline ms-1" :size="16" />
    </button>
  
    <div class="skills">
      <span v-for="skill in project.skills" :key="skill" class="skill-tag">
        <CheckCircle2 class="icon-inline" :size="14" />
        {{ skill }}
      </span>
    </div>

    <div class="project-links" v-if="project.github_url || project.demo_url">
      <a v-if="project.github_url" :href="project.github_url" target="_blank" rel="noopener noreferrer" class="btn btn-primary link-btn github-btn">
        <Github class="icon-inline" :size="16" /> Source Code
      </a>
      <a v-if="project.demo_url" :href="project.demo_url" target="_blank" rel="noopener noreferrer" class="btn btn-ghost link-btn demo-btn">
        <ExternalLink class="icon-inline" :size="16" /> Live Demo
      </a>
    </div>

    <div class="image-gallery">
      <img 
        v-for="(img, index) in project.images" 
        :key="index" 
        :src="getImageUrl(img)" 
        :alt="project.title + ' 圖片'"
        loading="lazy"
        class="gallery-thumb"
        @click="openLightbox(img)"
      />
    </div>

    <Teleport to="body">
      <div 
        v-if="selectedImage" 
        class="lightbox-overlay" 
        @click="closeLightbox"
      >
        <button aria-label="關閉圖片燈箱" class="close-btn">&times;</button>
        <img 
          :src="getImageUrl(selectedImage)" 
          class="lightbox-image" 
          alt="放大圖片" 
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageUrl } from '../utils.js'
// 引入上下箭頭圖示
import { User, Calendar, CheckCircle2, ChevronDown, ChevronUp, Github, ExternalLink } from 'lucide-vue-next'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

// 控制文字展開與收合的狀態
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const selectedImage = ref(null)

const openLightbox = (imageUrl) => {
  selectedImage.value = imageUrl
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedImage.value = null
  document.body.style.overflow = ''
}

const formattedDetails = computed(() => {
  if (!props.project.details) return ''
  
  return props.project.details.replace(
    /【(.*?)】/g, 
    '<span class="highlight-title">【$1】</span><br>'
  )
})
</script>

<style scoped>
.card {
  margin-bottom: 28px;
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  border: var(--card-border);
  background: linear-gradient(140deg, rgba(255, 253, 248, 0.96), rgba(250, 245, 234, 0.88));
  box-shadow: 0 12px 28px rgba(52, 48, 36, 0.09);
  transition: transform var(--duration-base) ease, box-shadow var(--duration-base) ease, border-color var(--duration-base) ease;
  text-align: left;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 35px rgba(42, 42, 32, 0.13);
  border-color: rgba(47, 93, 80, 0.35);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
}

.category {
  color: var(--primary-color);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: 'Manrope', sans-serif;
}

.period {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  font-weight: 500;
  font-size: var(--text-sm);
}

.card-title {
  margin: 0 0 10px;
  color: var(--text-main);
  text-align: left;
}

.role {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 14px;
  text-align: left;
}

.short-description {
  font-size: var(--text-md);
  font-weight: 600;
  color: #47695c;
  margin-bottom: var(--space-3);
  line-height: 1.5;
  border-left: 3px solid rgba(47, 93, 80, 0.4);
  padding-left: var(--space-3);
  text-align: left;
}

.icon-inline {
  margin-right: 6px;
  opacity: 0.8;
}

.ms-1 {
  margin-left: 4px;
  margin-right: 0;
}

/* 核心升級：文字收合外層容器 */
.description-wrapper {
  position: relative;
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.description-wrapper.is-expanded {
  max-height: 2000px;
}

.description {
  color: var(--text-muted);
  line-height: 1.9;
  margin-bottom: 0;
  font-size: 1rem;
  letter-spacing: 0.02em;
  white-space: pre-line;
  text-align: left;
}

.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255, 253, 248, 0), rgba(255, 251, 242, 1));
  pointer-events: none;
}

.expand-btn {
  gap: 2px;
  color: var(--primary-color);
  border-color: rgba(47, 93, 80, 0.28);
  background: transparent;
  border-radius: var(--radius-pill);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  margin-top: 8px;
  margin-bottom: 25px;
}

.expand-btn:hover {
  color: #f7f2e8;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.highlight-title) {
  display: inline-block;
  color: var(--primary-color);
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 4px;
  background-color: var(--primary-soft);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.92rem;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: rgba(236, 229, 216, 0.65);
  color: #3a4a43;
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  font-weight: 500;
  font-family: 'Manrope', 'Noto Serif TC', sans-serif;
  transition: all var(--duration-fast) ease;
  border: 1px solid rgba(47, 93, 80, 0.18);
}

.skill-tag:hover {
  background-color: rgba(215, 228, 223, 0.8);
  transform: translateY(-2px);
}

.project-links {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.link-btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-family: 'Manrope', sans-serif;
}

.github-btn {
  background-color: #1e293b;
  color: #f8fafc;
  border: 1px solid #0f172a;
}

.github-btn:hover {
  background-color: #334155;
  transform: translateY(-2px);
}

.demo-btn {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.demo-btn:hover {
  background-color: rgba(47, 93, 80, 0.08);
  transform: translateY(-2px);
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  margin-top: 10px;
}

.gallery-thumb {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 8px 18px rgba(26, 26, 20, 0.13);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  cursor: zoom-in;
}

.gallery-thumb:hover {
  transform: scale(1.015);
  box-shadow: 0 14px 24px rgba(17, 17, 12, 0.2);
}

@media (max-width: 620px) {
  .card {
    padding: 20px;
  }

  .image-gallery {
    grid-template-columns: 1fr;
  }

  .gallery-thumb {
    height: 220px;
  }
}
</style>

<style>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 24, 22, 0.88);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  cursor: zoom-out;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.65);
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 24px;
  color: rgba(255,255,255,0.7);
  font-size: 46px;
  font-weight: 200;
  cursor: pointer;
  z-index: 2001;
  transition: color 0.2s;
  background: none;
  border: none;
  padding: 0;
}

.close-btn:hover {
  color: #fff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>