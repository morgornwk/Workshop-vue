<template>
  <section id="personal" class="personal-section">
    <div class="personal-container">
      <div class="personal-header">
        <h2 class="personal-title">Personal &amp; Interests</h2>
        <p class="personal-sub">ไลฟ์สไตล์ สิ่งที่ชอบ จุดแข็ง และแรงบันดาลใจ</p>
      </div>

      <div class="bento-grid">
        <article class="bento-card">
          <div class="card-head">
            <span class="card-icon card-icon--orange">
              <v-icon size="18" color="#f97316">mdi-lightning-bolt-outline</v-icon>
            </span>
            <h3 class="card-title">จุดแข็ง (Key Strengths)</h3>
          </div>

          <ol class="strength-list">
            <li v-for="(item, i) in parsedStrengths" :key="'str-' + i" class="strength-row">
              <span class="strength-num">0{{ i + 1 }}</span>
              <div class="strength-copy">
                <div class="strength-heading">{{ item.title }}</div>
                <div v-if="item.desc" class="strength-desc">{{ item.desc }}</div>
              </div>
            </li>
          </ol>
        </article>

        <article class="bento-card bento-card--tinted">
          <div class="card-head">
            <span class="card-icon card-icon--slate">
              <v-icon size="18" color="#111827">mdi-palette-outline</v-icon>
            </span>
            <h3 class="card-title">ไลฟ์สไตล์และความชอบ</h3>
          </div>

          <div class="pref-groups">
            <div class="pref-block">
              <div class="pref-label">
                <span class="dot dot--orange"></span>
                งานอดิเรก
              </div>
              <div class="pill-row">
                <span v-for="(item, i) in profile.hobbies" :key="'h-' + i" class="pill pill--warm">
                  {{ item }}
                </span>
              </div>
            </div>

            <div class="pref-block">
              <div class="pref-label">
                <span class="dot dot--green"></span>
                สิ่งที่ชอบ
              </div>
              <div class="pill-row">
                <span v-for="(item, i) in profile.likes" :key="'l-' + i" class="pill pill--mint">
                  {{ item }}
                </span>
              </div>
            </div>

            <div class="pref-block">
              <div class="pref-label">
                <span class="dot dot--muted"></span>
                สิ่งที่ไม่ชอบ
              </div>
              <div class="pill-row">
                <span v-for="(item, i) in profile.dislikes" :key="'d-' + i" class="pill pill--neutral">
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article v-if="profile.favoriteTeam" class="bento-card team-card">
          <div class="team-badge">
            <v-icon size="28" color="#f97316">{{ profile.favoriteTeam.icon || 'mdi-basketball' }}</v-icon>
          </div>
          <div class="team-copy">
            <span class="team-eyebrow">ทีมกีฬาที่ชอบ · {{ profile.favoriteTeam.sport }}</span>
            <h3 class="team-name">{{ profile.favoriteTeam.name }}</h3>
            <p class="team-reason">{{ profile.favoriteTeam.reason }}</p>
          </div>
        </article>

        <article v-if="profile.freeSpace" class="bento-card motto-card">
          <span class="motto-eyebrow">Personal Motto · คติประจำใจ</span>
          <p class="motto-text">“{{ profile.freeSpace }}”</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PersonalSection',
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  computed: {
    parsedStrengths() {
      const list = this.profile.strengths || []
      return list.map((raw) => {
        const idx = raw.indexOf(' - ')
        if (idx === -1) return { title: raw, desc: '' }
        return {
          title: raw.slice(0, idx).trim(),
          desc: raw.slice(idx + 3).trim(),
        }
      })
    },
  },
}
</script>

<style scoped src="../../assets/style/components/personal-section.css"></style>
