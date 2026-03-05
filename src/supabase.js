import { createClient } from '@supabase/supabase-js'

// 透過 import.meta.env 讀取剛剛寫在 .env.local 裡面的環境變數
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 建立並匯出 Supabase 客戶端實例
export const supabase = createClient(supabaseUrl, supabaseAnonKey)