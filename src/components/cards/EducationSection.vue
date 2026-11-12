<template>
  <section id="edu" class="edu-section">
    <div class="edu-container">
      <div class="edu-layout">
        <div class="edu-header">
          <h2 class="edu-title">Education</h2>
          <p class="edu-sub">ประวัติและวุฒิการศึกษา</p>
        </div>

        <div class="edu-card">
          <div class="edu-icon-wrap">
            <v-icon size="26" color="#f97316">mdi-school-outline</v-icon>
          </div>

          <div class="edu-details">
            <div class="edu-top">
              <div>
                <h3 class="edu-uni">{{ education.university }}</h3>
                <p class="edu-major">
                  {{ education.major }}
                  <span class="edu-sep">·</span>
                  <span class="edu-campus">{{ education.campus }}</span>
                </p>
              </div>
              <span class="edu-year">{{ education.graduatedYear }}</span>
            </div>
          </div>
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

<style scoped src="../../assets/style/cards/education-section.css"></style>
