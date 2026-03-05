import { createClient } from '@supabase/supabase-js'

// 透過 import.meta.env 讀取剛剛寫在 .env.local 裡面的環境變數
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let hasValidSupabaseUrl = false

if (supabaseUrl) {
	try {
		const parsedUrl = new URL(supabaseUrl)
		hasValidSupabaseUrl = parsedUrl.protocol === 'https:' && parsedUrl.hostname.endsWith('supabase.co')
	} catch {
		hasValidSupabaseUrl = false
	}
}

const hasSupabaseConfig = Boolean(hasValidSupabaseUrl && supabaseAnonKey)

if (!hasSupabaseConfig) {
	console.warn('[Supabase] Invalid or missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Supabase features are disabled.')
}

// 建立並匯出 Supabase 客戶端實例；若未設定環境變數則回傳 null，避免整站崩潰
export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null