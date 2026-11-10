<template>
  <section class="tech-band" aria-label="Tech Stack">
    <div class="tech-band__track">
      <div v-for="(tech, i) in loop" :key="i" class="tech-card">
        <v-icon size="22" :color="tech.color" class="mr-2">{{ tech.icon }}</v-icon>
        <span class="tech-name">{{ tech.name }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StrengthBand',
  data: () => ({
    technologies: [
      { name: 'React', icon: 'mdi-react', color: '#61dafb' },
      { name: 'TypeScript', icon: 'mdi-language-typescript', color: '#3178c6' },
      { name: 'JavaScript', icon: 'mdi-language-javascript', color: '#f7df1e' },
      { name: 'Node.js', icon: 'mdi-nodejs', color: '#68a063' },
      { name: 'Python', icon: 'mdi-language-python', color: '#3776ab' },
      { name: 'Tailwind CSS', icon: 'mdi-tailwind', color: '#38bdf8' },
      { name: 'Docker', icon: 'mdi-docker', color: '#2496ed' },
      { name: 'Git', icon: 'mdi-git', color: '#f05032' },
      { name: 'Database', icon: 'mdi-database', color: '#f97316' },
      { name: 'HTML5', icon: 'mdi-language-html5', color: '#e34f26' },
      { name: 'CSS3', icon: 'mdi-language-css3', color: '#1572b6' },
    ],
  }),
  computed: {
    loop() {
      return Array(5).fill(this.technologies).flat()
    },
  },
}
</script>

<style scoped src="../../assets/style/components/StrengthBand.css"></style>
