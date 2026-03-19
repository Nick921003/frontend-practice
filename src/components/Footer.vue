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
  padding: 44px var(--space-5) 36px;
  background: linear-gradient(180deg, rgba(255, 252, 245, 0.18), rgba(255, 252, 245, 0.72));
  border-top: 1px solid var(--line);
  text-align: center;
}

.footer-container {
  max-width: 800px;
  margin: 0 auto;
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
  background-color: rgba(255, 253, 248, 0.85);
  color: var(--text-main);
  transition: all var(--duration-base) ease;
  border: 1px solid rgba(47, 93, 80, 0.24);
  font-family: 'Manrope', 'Noto Serif TC', sans-serif;
}

.social-btn:hover {
  background-color: var(--primary-color);
  color: #f9f3e8;
  transform: translateY(-2px);
}

.email-btn {
  cursor: pointer;
}

.email-btn.copied {
  background-color: #2f5d50;
  color: #f6f3ea;
  border-color: #2f5d50;
}

.copyright {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: 'Manrope', sans-serif;
}
</style>