<template>
  <div class="card">
    <div class="card-header">
      <span class="category">{{ project.category }}</span>
      <span class="period">{{ project.period }}</span>
    </div>
    <h2>{{ project.title }}</h2>
    <p class="role">擔任角色：{{ project.role }}</p>
    <p class="description">{{ project.details }}</p>
    
    <div class="skills">
      <span v-for="skill in project.skills" :key="skill" class="skill-tag">
        {{ skill }}
      </span>
    </div>

    <div class="image-gallery">
      <img 
        v-for="(img, index) in project.images" 
        :key="index" 
        :src="img" 
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
        <span class="close-btn">&times;</span>
        <img 
          :src="selectedImage" 
          class="lightbox-image" 
          alt="放大圖片" 
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  project: {
    type: Object,
    required: true
  }
})

const selectedImage = ref(null)

const openLightbox = (imageUrl) => {
  selectedImage.value = imageUrl
  // 修復：開啟燈箱時，禁止 body 滾動
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedImage.value = null
  // 修復：關閉燈箱時，恢復 body 滾動
  document.body.style.overflow = ''
}
</script>

<style scoped>
/* --- 原有卡片 CSS (保留) --- */
.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95em;
}

.category {
  font-weight: 700;
  color: #3b82f6; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.period {
  color: #888;
  font-weight: 500;
}

h2 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 1.8em;
  line-height: 1.3;
}

.role {
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 16px;
}

.description {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 24px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.skill-tag {
  background-color: #f3f4f6;
  color: #374151;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  transition: background-color 0.2s;
}

.skill-tag:hover {
  background-color: #e5e7eb;
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
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  cursor: zoom-in; 
}

.gallery-thumb:hover {
  transform: scale(1.03); 
}

/* --- Lightbox CSS 升級：增加最高 z-index 並移除 scoped 限制 (Teleport後) --- */
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
  /* 🌟 將 z-index 提高到極高，確保在 Navbar 之上 */
  z-index: 2000; 
  cursor: zoom-out;
  backdrop-filter: blur(10px); /* 增加背景模糊，讓圖片更立體 */
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
  font-weight: 200; /* 更纖細優雅的關閉按鈕 */
  cursor: pointer;
  z-index: 2001;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>