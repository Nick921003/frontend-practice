import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export function usePortfolioService() {
  const portfolioData = ref([])

  const fetchPublicProjects = async () => {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) portfolioData.value = data
    } catch (error) {
      console.error('獲取作品集資料失敗:', error)
    }
  }

  const portfolioItems = computed(() => {
    return portfolioData.value.filter(item => item.category === 'Graduation Project')
  })

  const experienceItems = computed(() => {
    return portfolioData.value.filter(item => item.category !== 'Graduation Project')
  })

  return {
    portfolioData,
    portfolioItems,
    experienceItems,
    fetchPublicProjects
  }
}
