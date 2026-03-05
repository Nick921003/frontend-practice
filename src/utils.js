// src/utils.js
/**
 * 解析圖片的公共路徑，支援開發環境、GitHub Pages (本地相對路徑) 以及 Supabase (雲端絕對路徑)。
 * @param {string} path - 來源於資料庫或本地的圖片路徑
 * @returns {string} - 完整的圖片 URL
 */
export const getImageUrl = (path) => {
  if (!path) return '';

  // 🌟 升級邏輯：如果是 Supabase 的雲端圖片 (http 開頭)，直接回傳真實網址
  if (path.startsWith('http')) {
    return path;
  }

  // 如果是本地 public 資料夾的圖片，才加上 GitHub Pages 的子目錄路徑
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // import.meta.env.BASE_URL 會自動讀取 vite.config.js 中的 base 設定 ('/frontend-practice/')
  return import.meta.env.BASE_URL + cleanPath;
}