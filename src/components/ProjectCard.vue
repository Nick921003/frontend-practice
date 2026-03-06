<template>
  <div class="card" data-aos="fade-up">
    <div class="card-header">
      <span class="category">{{ project.category }}</span>
      <span class="period">
        <Calendar class="icon-inline" :size="16" />
        {{ project.period }}
      </span>
    </div>
    <h2>{{ project.title }}</h2>
    <p class="role">
      <User class="icon-inline" :size="18" />
      擔任角色：{{ project.role }}
    </p>
    
    <p class="short-description">{{ project.short_description }}</p>
    
    <div class="description-wrapper" :class="{ 'is-expanded': isExpanded }">
      <p class="description" v-html="formattedDetails"></p>
      <div v-if="!isExpanded" class="fade-overlay"></div>
    </div>

    <button class="expand-btn" @click="toggleExpand" aria-label="切換顯示完整內容">
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
import { User, Calendar, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-vue-next'

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
  background-color: #ffffff;
  border-radius: 16px; 
  padding: 35px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  text-align: left; 
}

.card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.3); 
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.95em;
}

.category {
  font-weight: 700;
  color: var(--primary-color); 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Poppins', sans-serif;
}

.period {
  display: flex;
  align-items: center;
  color: #888;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

h2 {
  margin: 0 0 15px 0;
  color: var(--text-main);
  font-size: 1.8em;
  line-height: 1.3;
  letter-spacing: -0.5px;
  text-align: left; 
}

.role {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 16px;
  text-align: left;
}

.short-description {
  font-size: 1.05em;
  font-weight: 600;
  color: #3b82f6; 
  margin-bottom: 12px;
  line-height: 1.5;
  border-left: 3px solid #bfdbfe;
  padding-left: 10px;
  text-align: left; 
}

.icon-inline {
  margin-right: 6px;
  opacity: 0.75;
}

.ms-1 {
  margin-left: 4px;
  margin-right: 0;
}

/* 核心升級：文字收合外層容器 */
.description-wrapper {
  position: relative;
  max-height: 120px; /* 摺疊時的預設高度，約顯示三行 */
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.description-wrapper.is-expanded {
  max-height: 2000px; /* 展開時賦予足夠的空間容納長文 */
}

.description {
  color: var(--text-muted);
  line-height: 1.85; 
  margin-bottom: 0; /* 移除底部間距，交由外層控制 */
  font-size: 1.05em;
  letter-spacing: 0.5px; 
  white-space: pre-line; 
  text-align: left; 
}

/* 底部漸層遮罩 */
.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none;
}

/* 展開切換按鈕設計 */
.expand-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.95em;
  cursor: pointer;
  padding: 8px 0;
  margin-top: 5px;
  margin-bottom: 25px;
  transition: color 0.2s ease;
}

.expand-btn:hover {
  color: #2563eb;
}

:deep(.highlight-title) {
  display: inline-block;
  color: var(--primary-color);
  font-weight: 700;
  margin-top: 12px;
  margin-bottom: 4px;
  background-color: #eff6ff; 
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.95em;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.skill-tag {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  color: #334155;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.85em;
  font-weight: 500;
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.skill-tag:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.gallery-thumb {
  width: 100%;
  height: 220px;
  object-fit: cover; 
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  cursor: zoom-in; 
}

.gallery-thumb:hover {
  transform: scale(1.02); 
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
</style>

<style>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; 
  cursor: zoom-out;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain; 
  border-radius: 4px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.8);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  color: rgba(255,255,255,0.7);
  font-size: 50px;
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