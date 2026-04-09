<template>
  <section class="tab-section about-section">
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
        <img
          :src="getImageUrl('/images/profile.webp')"
          alt="彭俊瑋的個人照"
          class="profile-image"
          width="360"
          height="480"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        <div class="image-backdrop"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue'
import { useTypingEffect } from '../composables/useTypingEffect'
import { useLocale } from '../composables/useLocale'
import { getImageUrl } from '../utils'

const { typeValue, typeStatus } = useTypingEffect()
const { locale, t } = useLocale()
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

.about-section {
  position: relative;
  border: var(--card-border);
  border-radius: var(--radius-xl);
  padding: clamp(24px, 4vw, 48px);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(250, 250, 251, 0.78));
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.about-section::before {
  content: '';
  position: absolute;
  right: -20px;
  top: -24px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(146, 64, 14, 0.1), rgba(146, 64, 14, 0));
  pointer-events: none;
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
  color: var(--accent-color);
  font-weight: 600;
}

.typing-text {
  font-family: 'Archivo', 'Space Grotesk', sans-serif;
  letter-spacing: 0.04em;
}

.cursor {
  display: inline-block;
  width: 2px;
  margin-left: 3px;
  background: var(--accent-color);
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
  transform: rotate(-1.2deg);
  transition: transform var(--duration-base) ease, box-shadow var(--duration-base) ease;
}

.about-image-wrapper:hover .profile-image {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 0 28px 52px rgba(36, 42, 39, 0.24);
}

.image-backdrop {
  position: absolute;
  z-index: 1;
  inset: 14px -16px -14px 16px;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(146, 64, 14, 0.16), rgba(120, 53, 15, 0.12));
}

.skills-showcase {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px dashed rgba(146, 64, 14, 0.2);
}

.skills-title {
  font-family: 'Space Grotesk', 'Archivo', sans-serif;
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
  color: var(--primary-deep);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-family: 'Archivo', 'Space Grotesk', sans-serif;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition: background-color var(--duration-fast) ease, border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
}

.chip:hover {
  background-color: rgba(146, 64, 14, 0.08);
  border-color: rgba(146, 64, 14, 0.35);
  box-shadow: 0 6px 14px rgba(146, 64, 14, 0.12);
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
  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-image-wrapper {
    order: -1;
  }
}
</style>
