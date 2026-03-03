<template>
  <footer class="footer">
    <div class="footer-container">
      <h3 class="footer-title">Let's Connect!</h3>
      <div class="social-links">
        <a href="https://github.com/Nick921003" target="_blank" rel="noopener noreferrer" class="social-btn">
          <Github class="icon" :size="20" />
          <span>GitHub</span>
        </a>
        
        <button @click="copyEmail" class="social-btn email-btn" :class="{ 'copied': isCopied }">
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
  margin-top: 60px;
  padding: 40px 20px;
  background-color: #fff;
  border-top: 1px solid rgba(0,0,0,0.05);
  text-align: center;
}

.footer-container {
  max-width: 800px;
  margin: 0 auto;
}

.footer-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5em;
  color: var(--text-main);
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--bg-color);
  color: var(--text-main);
  border-radius: 30px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  font-family: 'Poppins', 'Noto Sans TC', sans-serif;
}

.social-btn:hover {
  background-color: #eff6ff;
  color: var(--primary-color);
  transform: translateY(-2px);
}

.email-btn {
  cursor: pointer;
}

.email-btn.copied {
  background-color: #ecfdf5;
  color: #10b981;
  border-color: #a7f3d0;
}

.copyright {
  font-size: 0.9em;
  color: var(--text-muted);
  font-family: 'Poppins', sans-serif;
}
</style>