<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <div class="logo">系統管理後台</div>
      <router-link to="/" class="back-link">← 返回作品集首頁</router-link>
    </nav>

    <main class="admin-container">
      <div v-if="!isLoggedIn" class="login-card">
        <h2>管理員登入</h2>
        <p class="subtitle">請輸入您的 Supabase 專屬帳號</p>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">電子郵件</label>
            <input id="email" v-model="email" type="email" placeholder="admin@example.com" required />
          </div>
          <div class="form-group">
            <label for="password">密碼</label>
            <input id="password" v-model="password" type="password" placeholder="••••••••" required />
          </div>
          <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '驗證中...' : '登入' }}
          </button>
        </form>
      </div>

      <div v-else class="dashboard-wrapper">
        <div class="dashboard-header">
          <h2>內容管理系統 (CMS)</h2>
          <button @click="handleLogout" class="logout-btn">登出系統</button>
        </div>
        
        <div class="dashboard-grid">
          <div class="dashboard-card form-section">
            <h3 class="section-title">{{ isEditing ? '✏️ 編輯經歷' : '✨ 新增經歷' }}</h3>
            <form @submit.prevent="submitPortfolio" class="cms-form">
              <div class="form-row">
                <div class="form-group half">
                  <label>標題 (Title) *</label>
                  <input v-model="formData.title" type="text" placeholder="例：草莓病蟲害辨識系統" required />
                </div>
                <div class="form-group half">
                  <label>分類 (Category) *</label>
                  <select v-model="formData.category" required>
                    <option value="Graduation Project">專題 (Graduation Project)</option>
                    <option value="Academic Exchange">學術交流 (Academic Exchange)</option>
                    <option value="Extracurricular">課外活動 (Extracurricular)</option>
                    <option value="Competition">競賽 (Competition)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group half">
                  <label>發生時期 (Period)</label>
                  <input v-model="formData.period" type="text" placeholder="例：2026 Winter" />
                </div>
                <div class="form-group half">
                  <label>擔任角色 (Role)</label>
                  <input v-model="formData.role" type="text" placeholder="例：Backend Developer" />
                </div>
              </div>

              <div class="form-group">
                <label>使用技能 (Skills) - 請用逗號隔開</label>
                <input v-model="formData.skills" type="text" placeholder="例：Vue.js, Docker, AWS" />
              </div>

              <div class="form-group">
                <label>簡短摘要 (Short Description) *</label>
                <input v-model="formData.short_description" type="text" placeholder="一句話總結這個經歷的亮點" required />
              </div>

              <div class="form-group">
                <label>詳細內容 (Details) *</label>
                <textarea v-model="formData.details" rows="4" placeholder="詳細描述你解決了什麼問題..." required></textarea>
              </div>

              <div class="form-group">
                <label>上傳新圖片 (若不更新圖片請留空)</label>
                <input type="file" @change="handleFileChange" multiple accept="image/*" class="file-input" />
                <ul v-if="selectedFiles.length > 0" class="file-list">
                  <li v-for="(file, index) in selectedFiles" :key="index">📄 {{ file.name }}</li>
                </ul>
              </div>

              <div v-if="uploadStatus" class="status-msg" :class="{ 'success': isSuccess, 'error': !isSuccess }">
                {{ uploadStatus }}
              </div>

              <div class="form-actions">
                <button v-if="isEditing" type="button" class="cancel-btn" @click="cancelEdit">取消編輯</button>
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  {{ isSubmitting ? '處理中...' : (isEditing ? '💾 更新資料' : '🚀 發布資料') }}
                </button>
              </div>
            </form>
          </div>

          <div class="dashboard-card list-section">
            <h3 class="section-title">📂 現有資料列表</h3>
            <div v-if="isFetching" class="loading-text">載入資料中...</div>
            <div v-else-if="existingProjects.length === 0" class="empty-text">目前資料庫沒有任何經歷。</div>
            <ul v-else class="project-list">
              <li v-for="item in existingProjects" :key="item.id" class="project-item">
                <div class="project-info">
                  <span class="project-tag" :class="item.category === 'Graduation Project' ? 'tag-portfolio' : 'tag-experience'">
                    {{ item.category === 'Graduation Project' ? '作品集' : '經歷' }}
                  </span>
                  <h4>{{ item.title }}</h4>
                </div>
                <div class="project-actions">
                  <button @click="editProject(item)" class="action-btn edit">編輯</button>
                  <button @click="deleteProject(item.id)" class="action-btn delete">刪除</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import imageCompression from 'browser-image-compression'

// --- 狀態管理 ---
const isLoggedIn = ref(false)
const isLoading = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const isSubmitting = ref(false)
const uploadStatus = ref('')
const isSuccess = ref(true)
const selectedFiles = ref([])

// CRUD 專用狀態
const existingProjects = ref([])
const isFetching = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const formData = ref({
  title: '',
  category: 'Graduation Project',
  period: '',
  role: '',
  skills: '',
  short_description: '',
  details: '',
  images: [] // 保留舊圖片用
})

// --- 登入驗證 ---
const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    isLoggedIn.value = true
    fetchProjects() // 登入後自動抓取現有資料
  }
}

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (error) throw error
    isLoggedIn.value = true
    password.value = '' 
    fetchProjects()
  } catch (error) {
    errorMessage.value = '登入失敗：帳號或密碼錯誤。'
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  isLoggedIn.value = false
}

// --- CRUD 邏輯 ---

// [Read] 讀取資料列表
const fetchProjects = async () => {
  isFetching.value = true
  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false }) // 新的排前面
    
    if (error) throw error
    existingProjects.value = data
  } catch (error) {
    console.error('讀取資料失敗:', error)
  } finally {
    isFetching.value = false
  }
}

// [Delete] 刪除資料
const deleteProject = async (id) => {
  if (!confirm('確定要刪除這筆資料嗎？刪除後無法復原。')) return

  try {
    const { error } = await supabase.from('portfolio').delete().eq('id', id)
    if (error) throw error
    
    uploadStatus.value = '🗑️ 刪除成功'
    isSuccess.value = true
    fetchProjects() // 重新整理列表
  } catch (error) {
    alert('刪除失敗: ' + error.message)
  }
}

// [Update] 進入編輯模式，回填資料
const editProject = (project) => {
  isEditing.value = true
  editingId.value = project.id
  
  formData.value = {
    title: project.title,
    category: project.category,
    period: project.period || '',
    role: project.role || '',
    skills: project.skills ? project.skills.join(', ') : '',
    short_description: project.short_description || '',
    details: project.details || '',
    images: project.images || []
  }
  selectedFiles.value = []
  uploadStatus.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' }) // 自動捲動到表單
}

const cancelEdit = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    title: '', category: 'Graduation Project', period: '', role: '',
    skills: '', short_description: '', details: '', images: []
  }
  selectedFiles.value = []
  uploadStatus.value = ''
}

const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files)
}

// [Create & Update] 提交表單核心邏輯
const submitPortfolio = async () => {
  isSubmitting.value = true
  uploadStatus.value = '處理中...'
  isSuccess.value = true
  
  try {
    let finalImageUrls = [...formData.value.images] // 預設使用舊圖片

    // 如果有上傳新圖片，則壓縮並上傳
    if (selectedFiles.value.length > 0) {
      uploadStatus.value = '正在壓縮並上傳新圖片...'
      finalImageUrls = [] // 清空舊圖片，改用新的
      
      for (const file of selectedFiles.value) {
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' }
        const compressedFile = await imageCompression(file, options)
        const fileName = `${Date.now()}-${file.name.split('.')[0]}.webp`
        
        const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(fileName, compressedFile)
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from('portfolio-images').getPublicUrl(fileName)
        finalImageUrls.push(publicUrlData.publicUrl)
      }
    }

    const skillsArray = formData.value.skills ? formData.value.skills.split(',').map(s => s.trim()).filter(s => s !== '') : []
    
    const projectData = {
      category: formData.value.category,
      title: formData.value.title,
      period: formData.value.period,
      role: formData.value.role,
      skills: skillsArray,
      short_description: formData.value.short_description,
      details: formData.value.details,
      images: finalImageUrls
    }

    if (isEditing.value) {
      // 執行 Update
      uploadStatus.value = '正在更新資料庫...'
      const { error } = await supabase.from('portfolio').update(projectData).eq('id', editingId.value)
      if (error) throw error
      uploadStatus.value = '✅ 更新成功！'
    } else {
      // 執行 Insert
      uploadStatus.value = '正在寫入資料庫...'
      projectData.id = `proj-${Date.now()}`
      const { error } = await supabase.from('portfolio').insert(projectData)
      if (error) throw error
      uploadStatus.value = '🎉 發布成功！'
    }

    isSuccess.value = true
    cancelEdit() // 清空表單
    fetchProjects() // 刷新列表
    
  } catch (error) {
    console.error(error)
    uploadStatus.value = `發生錯誤: ${error.message}`
    isSuccess.value = false
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  checkSession()
})
</script>

<style scoped>
/* 基礎樣式保留 */
.admin-layout { min-height: 100vh; background-color: #f8fafc; font-family: -apple-system, sans-serif; }
.admin-nav { background-color: #1e293b; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.logo { font-weight: 700; font-size: 1.2em; }
.back-link { color: #94a3b8; text-decoration: none; font-size: 0.9em; }
.back-link:hover { color: #fff; }
.admin-container { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }

/* 登入卡片 */
.login-card { background: white; max-width: 420px; margin: 40px auto; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
h2 { text-align: center; color: #0f172a; margin-top: 0; }
.subtitle { text-align: center; color: #64748b; margin-bottom: 30px; }

/* 儀表板雙欄佈局 */
.dashboard-wrapper { width: 100%; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.logout-btn { background: #e2e8f0; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; color: #475569; }
.logout-btn:hover { background: #cbd5e1; color: #0f172a; }

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 左邊表單大，右邊列表小 */
  gap: 30px;
  align-items: start;
}

.dashboard-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.section-title { font-size: 1.2em; color: #1e293b; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }

/* 表單樣式 */
.form-row { display: flex; gap: 20px; }
.form-group { margin-bottom: 20px; width: 100%; }
.form-group.half { flex: 1; }
label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9em; }
input[type="email"], input[type="password"], input[type="text"], select, textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-family: inherit;
}
input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
textarea { resize: vertical; min-height: 100px; }

/* 按鈕與狀態 */
.form-actions { display: flex; gap: 10px; margin-top: 20px; }
.submit-btn { flex: 1; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
.submit-btn:hover:not(:disabled) { background: #2563eb; }
.submit-btn:disabled { background: #94a3b8; cursor: not-allowed; }
.cancel-btn { padding: 12px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
.cancel-btn:hover { background: #e2e8f0; }

.status-msg { padding: 10px; border-radius: 6px; text-align: center; margin-bottom: 15px; font-weight: 600; }
.status-msg.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.status-msg.error { background: #fef2f2; color: #ef4444; border: 1px solid #fca5a5; }

.file-input { display: block; width: 100%; padding: 10px; border: 2px dashed #cbd5e1; background: #f8fafc; border-radius: 6px; }
.file-list { padding: 0; list-style: none; margin-top: 10px; font-size: 0.85em; }

/* 🌟 右側列表區塊樣式 */
.project-list { list-style: none; padding: 0; margin: 0; }
.project-item { padding: 15px 0; border-bottom: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 10px; }
.project-item:last-child { border-bottom: none; }
.project-info h4 { margin: 5px 0 0 0; color: #1e293b; font-size: 1.05em; line-height: 1.4; }
.project-tag { font-size: 0.75em; font-weight: 700; padding: 3px 8px; border-radius: 12px; }
.tag-portfolio { background: #dbeafe; color: #1d4ed8; }
.tag-experience { background: #fef3c7; color: #b45309; }

.project-actions { display: flex; gap: 8px; }
.action-btn { padding: 5px 10px; font-size: 0.85em; border-radius: 4px; border: none; cursor: pointer; font-weight: 600; }
.action-btn.edit { background: #f1f5f9; color: #3b82f6; }
.action-btn.edit:hover { background: #e0e7ff; }
.action-btn.delete { background: #fef2f2; color: #ef4444; }
.action-btn.delete:hover { background: #fee2e2; }

@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
</style>