import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useNavigation() {
  const isNavExpanded = ref(false)
  const isNavPinned = ref(false)
  const isMobileMode = ref(false)
  const canHover = ref(true)
  const isNavHidden = ref(false) // 滾動時隱藏導航欄
  
  const isNavOpen = computed(() => isNavExpanded.value || isNavPinned.value)

  let mobileMediaQuery = null
  let hoverMediaQuery = null
  let lastScrollTop = 0

  const updateInputMode = () => {
    if (!mobileMediaQuery || !hoverMediaQuery) return
    isMobileMode.value = mobileMediaQuery.matches
    canHover.value = hoverMediaQuery.matches

    // 手機版預設收合，改由點擊圖示展開
    if (isMobileMode.value) {
      isNavExpanded.value = false
      isNavPinned.value = false
      return
    }

    // 回到桌機時避免殘留手機展開狀態
    isNavExpanded.value = false
  }

  const handleNavMouseEnter = () => {
    if (isMobileMode.value || !canHover.value || isNavPinned.value) return
    isNavExpanded.value = true
  }

  const handleNavMouseLeave = () => {
    if (isMobileMode.value || !canHover.value || isNavPinned.value) return
    isNavExpanded.value = false
  }

  const toggleNavOnClick = () => {
    if (isMobileMode.value) {
      isNavExpanded.value = !isNavExpanded.value
      return
    }

    isNavPinned.value = !isNavPinned.value
    isNavExpanded.value = isNavPinned.value
  }

  const handleScroll = () => {
    const currentScroll = window.scrollY || document.documentElement.scrollTop
    
    // 如果導航欄展開中，不要隱藏
    if (isNavExpanded.value) {
      isNavHidden.value = false
      lastScrollTop = currentScroll
      return
    }
    
    // 桌機版本：釘住時不隱藏
    if (!isMobileMode.value && isNavPinned.value) {
      isNavHidden.value = false
      lastScrollTop = currentScroll
      return
    }
    
    // 向下滑動時隱藏，向上滑動時顯示
    if (currentScroll > lastScrollTop) {
      isNavHidden.value = true
    } else {
      isNavHidden.value = false
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll
  }

  const handleMouseMove = (e) => {
    // 只在桌機版本且未釘住時生效
    if (isMobileMode.value || isNavPinned.value) return
    
    // 鼠標在頂部 50px 內時顯示導航欄
    if (e.clientY < 50) {
      isNavHidden.value = false
    }
  }

  onMounted(() => {
    mobileMediaQuery = window.matchMedia('(max-width: 920px)')
    hoverMediaQuery = window.matchMedia('(hover: hover)')
    updateInputMode()
    mobileMediaQuery.addEventListener('change', updateInputMode)
    hoverMediaQuery.addEventListener('change', updateInputMode)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
  })

  onUnmounted(() => {
    if (mobileMediaQuery) {
      mobileMediaQuery.removeEventListener('change', updateInputMode)
    }
    if (hoverMediaQuery) {
      hoverMediaQuery.removeEventListener('change', updateInputMode)
    }
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('mousemove', handleMouseMove)
  })

  return {
    isNavExpanded,
    isNavPinned,
    isMobileMode,
    canHover,
    isNavHidden,
    isNavOpen,
    handleNavMouseEnter,
    handleNavMouseLeave,
    toggleNavOnClick
  }
}
