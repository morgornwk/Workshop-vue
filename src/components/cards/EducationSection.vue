<template>
  <section id="edu" class="edu-section">
    <div class="edu-container">
      <div class="edu-header">
        <h2 class="edu-title">Education</h2>
        <p class="edu-sub">ประวัติและวุฒิการศึกษา</p>
      </div>

      <div class="edu-card">
        <div class="edu-icon-wrap">
          <v-icon size="32" color="#f97316">mdi-school-outline</v-icon>
        </div>

        <div class="edu-details">
          <div class="d-flex flex-wrap justify-space-between align-center mb-1">
            <h3 class="edu-uni">{{ education.university }}</h3>
            <span class="edu-year">{{ education.graduatedYear }}</span>
          </div>

          <p class="edu-major">{{ education.major }} · <span class="edu-campus">{{ education.campus }}</span></p>

          <p v-if="education.note" class="edu-note">{{ education.note }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'EducationSection',
  props: {
    education: { type: Object, default: () => ({}) },
  },
}
</script>

<style scoped src="../../assets/style/components/EducationSection.css">
