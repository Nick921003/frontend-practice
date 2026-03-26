import { ref } from 'vue'

export function useTabNavigation() {
  const currentTab = ref('about')

  const selectTab = (tab) => {
    currentTab.value = tab
  }

  return {
    currentTab,
    selectTab
  }
}
