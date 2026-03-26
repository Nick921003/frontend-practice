import { ref, onMounted, onUnmounted } from 'vue'

export function useTypingEffect() {
  const typeValue = ref('')
  const typeStatus = ref(false)
  const displayTextArray = ['EE Student @ CYCU', 'Hardware-Software Integrator', 'Passionate Maker']
  const typingSpeed = 100
  const erasingSpeed = 50
  const newTextDelay = 2000
  let displayTextArrayIndex = 0
  let charIndex = 0
  let typeInterval = null

  const typeText = () => {
    if (charIndex < displayTextArray[displayTextArrayIndex].length) {
      if (!typeStatus.value) typeStatus.value = true
      typeValue.value += displayTextArray[displayTextArrayIndex].charAt(charIndex)
      charIndex += 1
      typeInterval = setTimeout(typeText, typingSpeed)
    } else {
      typeStatus.value = false
      typeInterval = setTimeout(eraseText, newTextDelay)
    }
  }

  const eraseText = () => {
    if (charIndex > 0) {
      if (!typeStatus.value) typeStatus.value = true
      typeValue.value = displayTextArray[displayTextArrayIndex].substring(0, charIndex - 1)
      charIndex -= 1
      typeInterval = setTimeout(eraseText, erasingSpeed)
    } else {
      typeStatus.value = false
      displayTextArrayIndex += 1
      if (displayTextArrayIndex >= displayTextArray.length) displayTextArrayIndex = 0
      typeInterval = setTimeout(typeText, typingSpeed + 1000)
    }
  }

  onMounted(() => {
    typeInterval = setTimeout(typeText, 500)
  })

  onUnmounted(() => {
    clearTimeout(typeInterval)
  })

  return {
    typeValue,
    typeStatus
  }
}
