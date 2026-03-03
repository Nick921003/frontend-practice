// src/utils.js
/**
 * 解析圖片的公共路徑，使其在開發環境和 GitHub Pages 上都能正常顯示。
 * @param {string} path - 來源於 portfolio.json 的圖片路徑 (例如 /images/profile.webp)
 * @returns {string} - 完整的圖片 URL
 */
export const getImageUrl = (path) => {
  // 移除路徑開頭的 '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // import.meta.env.BASE_URL 會自動讀取 vite.config.js 中的 base 設定 ('/frontend-practice/')
  return import.meta.env.BASE_URL + cleanPath;
}
