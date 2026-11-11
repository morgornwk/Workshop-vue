<template>
  <svg class="torn" viewBox="0 0 1200 34" preserveAspectRatio="none" aria-hidden="true">
    <path class="torn__paper" :d="paperPath" fill="#fff" />
    <path :d="colorPath" :fill="fill" />
  </svg>
</template>

<script>
function path(seed, offset, lo, hi, bottom = 36) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const y = () => Math.floor(lo + rnd() * (hi - lo)) + offset
  let x = 0
  const pts = [`M0,${bottom} L0,${y()}`]
  while (x < 1200) {
    x = Math.min(1200, x + 9 + Math.floor(rnd() * 17))
    pts.push(`L${x},${y()}`)
  }
  pts.push(`L1200,${bottom} Z`)
  return pts.join(' ')
}

export default {
  name: 'TornEdge',
  props: {
    fill: { type: String, required: true },
    seed: { type: Number, default: 7 },
  },
  computed: {
    paperPath() { return path(this.seed, 0, 3, 14, 30) },
    colorPath() { return path(this.seed + 11, 6, 8, 22, 36) },
  },
}
</script>

<style scoped>
.torn {
  display: block;
  width: 100%;
  height: 34px;
  margin-top: -32px;
  margin-bottom: -2px;
  position: relative;
  z-index: 2;
}
.torn__paper {
  filter: drop-shadow(0 -3px 3px rgba(0, 0, 0, 0.25));
}
</style>
