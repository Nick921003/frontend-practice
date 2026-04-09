<template>
  <footer class="footer">
    <div class="footer-container">
      <h3 class="footer-title heading-3">Let's Connect!</h3>
      <div class="social-links">
        <a href="https://github.com/Nick921003" target="_blank" rel="noopener noreferrer" class="btn btn-ghost social-btn">
          <Github class="icon" :size="20" />
          <span>GitHub</span>
        </a>
        
        <button @click="copyEmail" class="btn btn-ghost social-btn email-btn" :class="{ 'copied': isCopied }">
          <Check v-if="isCopied" class="icon" :size="20" />
          <Mail v-else class="icon" :size="20" />
          <span>{{ isCopied ? '已複製信箱！' : 'pjw9210@gmail.com' }}</span>
        </button>
      </div>
      <p class="copyright">© 2026 Chun-Wei Peng. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { Github, Mail, Check } from 'lucide-vue-next'

const isCopied = ref(false)

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('pjw9210@gmail.com')
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000) // 2秒後恢復原狀
  } catch (err) {
    console.error('複製失敗:', err)
  }
}
</script>

<style scoped>
.footer {
  margin-top: 44px;
  padding: 52px var(--space-5) 40px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.82));
  border-top: 1px solid rgba(228, 228, 231, 0.8);
  text-align: center;
}

.footer-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 26px 18px;
  border: 1px solid rgba(228, 228, 231, 0.85);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.footer-title {
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.social-btn {
  padding: 10px var(--space-5);
  background-color: rgba(255, 255, 255, 0.96);
  color: var(--text-main);
  transition: all var(--duration-base) ease;
  border: 1px solid rgba(146, 64, 14, 0.24);
  font-family: 'Space Grotesk', 'Archivo', sans-serif;
}

.social-btn:hover {
  background-color: var(--accent-color);
  color: #ffffff;
  transform: translateY(-2px);
}

.email-btn {
  cursor: pointer;
}

.email-btn.copied {
  background-color: var(--accent-color);
  color: #ffffff;
  border-color: var(--accent-color);
}

.copyright {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: 'Archivo', 'Space Grotesk', sans-serif;
}
</style>