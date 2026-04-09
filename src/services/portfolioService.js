import { ref, computed } from 'vue'
import { supabase } from '../supabase'

const portfolioData = ref([])
const isLoading = ref(false)
const hasFetched = ref(false)
let fetchPromise = null

export function usePortfolioService() {
  const fetchPublicProjects = async () => {
    if (!supabase || hasFetched.value || fetchPromise) {
      return fetchPromise
    }

    isLoading.value = true
    fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      if (data) {
        portfolioData.value = data
      }
      hasFetched.value = true
    } catch (error) {
      console.error('獲取作品集資料失敗:', error)
    } finally {
      isLoading.value = false
      fetchPromise = null
    }
    })()

    return fetchPromise
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
    isLoading,
    hasFetched,
    fetchPublicProjects
  }
}
