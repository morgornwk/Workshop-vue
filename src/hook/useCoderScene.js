import { ref, onMounted, onBeforeUnmount } from 'vue'
import { buildDeveloperScene } from '@/three/buildDeveloperScene'


export function useCoderScene() {
  const stageRef = ref(null)
  let controller = null
  let onMouseMove = null
  let onResize = null

  onMounted(() => {
    const el = stageRef.value
    if (!el) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    try {
      controller = buildDeveloperScene(el, { reducedMotion })
    } catch (e) {
      return
    }

    onMouseMove = (e) => {
      if (!el || !controller) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / Math.max(window.innerWidth * 0.5, 280)
      const ny = -(e.clientY - cy) / Math.max(window.innerHeight * 0.5, 240)
      controller.setPointer(nx, ny)
    }

    onResize = () => {
      if (controller) controller.resize()
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  })

  onBeforeUnmount(() => {
    if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
    if (onResize) window.removeEventListener('resize', onResize)
    if (controller) controller.dispose()
  })

  return { stageRef }
}
