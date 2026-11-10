<template>
  <main>
    <Navbar />
    <HeroFrame id="about" :profile="profile" />
    <StrengthBand :strengths="profile.strengths" />
    <EducationSection id="edu" :education="profile.education" />
    <PersonalSection id="personal" :profile="profile" />
    <AppFooter id="contact" :profile="profile" />
  </main>
</template>

<script>
import profile from '@/data/profile'
import Navbar from '@/components/cards/Navbar.vue'
import HeroFrame from '@/components/cards/HeroFrame.vue'
import StrengthBand from '@/components/cards/StrengthBand.vue'
import EducationSection from '@/components/cards/EducationSection.vue'
import PersonalSection from '@/components/cards/PersonalSection.vue'
import AppFooter from '@/components/cards/AppFooter.vue'

export default {
  name: 'HomeView',
  components: { 
    Navbar, 
    HeroFrame, 
    StrengthBand, 
    EducationSection,
    PersonalSection,
    AppFooter
  },
  data: () => ({
    profile,
  }),
}
</script>
