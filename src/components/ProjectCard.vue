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
    <p class="description">{{ project.details }}</p>
  
    
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
import { ref } from 'vue'
import { getImageUrl } from '../utils.js'
// 🌟 引入 Lucide 圖示
import { User, Calendar, CheckCircle2 } from 'lucide-vue-next'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

const selectedImage = ref(null)

const openLightbox = (imageUrl) => {
  selectedImage.value = imageUrl
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedImage.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 16px; /* 稍微增加圓角，與首頁呼應 */
  padding: 35px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.3); /* Hover 時外框有一點點科技藍 */
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
}

.role {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 16px;
}
.short-description {
  font-size: 1.05em;
  font-weight: 600;
  color: #3b82f6; /* 使用主色調突顯重點 */
  margin-bottom: 12px;
  line-height: 1.5;
  border-left: 3px solid #bfdbfe;
  padding-left: 10px;
}

/* 🌟 圖示垂直置中微調 */
.icon-inline {
  margin-right: 6px;
  opacity: 0.75;
}

.description {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 25px;
  font-size: 1.05em;
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