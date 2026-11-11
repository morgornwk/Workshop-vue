<template>
  <div class="coder-scene-wrap">
    <div class="floating-icons" aria-hidden="true">
      <div
        v-for="(item, idx) in floatingIcons"
        :key="item.icon"
        class="float-chip"
        :class="`float-chip--${idx + 1}`"
      >
        <v-icon size="20" :color="item.color">{{ item.icon }}</v-icon>
      </div>
    </div>

    <div
      ref="stageRef"
      class="coder-canvas"
      aria-label="Interactive 3D Developer Coding Character"
    ></div>
  </div>
</template>

<script>
import { useCoderScene } from '@/hook/useCoderScene'

export default {
  name: 'CoderScene3D',
  setup() {
    const { stageRef } = useCoderScene()
    const floatingIcons = [
      { icon: 'mdi-code-braces', color: '#f97316' },
      { icon: 'mdi-console', color: '#22d3ee' },
      { icon: 'mdi-cube-outline', color: '#a855f7' },
      { icon: 'mdi-laptop', color: '#38bdf8' },
    ]
    return { stageRef, floatingIcons }
  },
}
</script>

<style scoped src="../../assets/style/auth/coder-scene.css"></style>
