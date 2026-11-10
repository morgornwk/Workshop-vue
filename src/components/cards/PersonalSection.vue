<template>
  <section id="personal" class="personal-section">
    <div class="personal-container">
      <!-- Section Header -->
      <div class="personal-header">
        <h2 class="personal-title">Personal and Interests</h2>
        <p class="personal-sub">ไลฟ์สไตล์ สิ่งที่ชอบ จุดแข็ง และแรงบันดาลใจ</p>
      </div>

      <div class="personal-grid">
        <!-- Hobbies & Likes & Dislikes -->
        <div class="card card--full">
          <div class="card-columns">
            <!-- Hobbies -->
            <div class="col-group">
              <div class="col-title">
                <v-icon size="20" color="#f97316" class="mr-1">mdi-gamepad-variant-outline</v-icon>
                <span>งานอดิเรก</span>
              </div>
              <ul class="item-list">
                <li v-for="(item, i) in profile.hobbies" :key="'hobby-' + i" class="item-tag item-tag--orange">
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Likes -->
            <div class="col-group">
              <div class="col-title">
                <v-icon size="20" color="#10b981" class="mr-1">mdi-thumb-up-outline</v-icon>
                <span>สิ่งที่ชอบ</span>
              </div>
              <ul class="item-list">
                <li v-for="(item, i) in profile.likes" :key="'like-' + i" class="item-tag item-tag--green">
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Dislikes -->
            <div class="col-group">
              <div class="col-title">
                <v-icon size="20" color="#ef4444" class="mr-1">mdi-thumb-down-outline</v-icon>
                <span>สิ่งที่ไม่ชอบ</span>
              </div>
              <ul class="item-list">
                <li v-for="(item, i) in profile.dislikes" :key="'dislike-' + i" class="item-tag item-tag--gray">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Strengths Card -->
        <div class="card">
          <div class="card-head">
            <v-icon size="22" color="#f97316" class="mr-2">mdi-lightning-bolt-outline</v-icon>
            <h3 class="card-title">จุดแข็ง (Key Strengths)</h3>
          </div>
          <ul class="strength-list">
            <li v-for="(s, i) in profile.strengths" :key="'str-' + i" class="strength-item">
              <v-icon size="16" color="#f97316" class="mr-2">mdi-check-circle-outline</v-icon>
              <span>{{ s }}</span>
            </li>
          </ul>
        </div>

        <!-- Favorite Sports Team -->
        <div class="card" v-if="profile.favoriteTeam">
          <div class="card-head">
            <v-icon size="22" color="#f97316" class="mr-2">mdi-trophy-outline</v-icon>
            <h3 class="card-title">ทีมกีฬาที่ชอบ</h3>
          </div>
          <div class="team-body">
            <div class="team-badge">
              <v-icon size="36" color="#f97316">{{ profile.favoriteTeam.icon || 'mdi-soccer' }}</v-icon>
            </div>
            <div>
              <h4 class="team-name">{{ profile.favoriteTeam.name }}</h4>
              <p class="team-meta">{{ profile.favoriteTeam.sport }}</p>
              <p class="team-reason">{{ profile.favoriteTeam.reason }}</p>
            </div>
          </div>
        </div>

        <!-- Free Design / Motto Space -->
        <div class="card card--accent card--full">
          <div class="free-space-inner">
            <div class="free-space-icon">
              <v-icon size="32" color="#ffffff">mdi-format-quote-open</v-icon>
            </div>
            <div class="free-space-content">
              <span class="free-space-tag">คติประจำใจ</span>
              <p class="free-space-text">“{{ profile.freeSpace }}”</p>
            </div>
          </div>
        </div>
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
}
</script>

<style scoped src="../../assets/style/components/PersonalSection.css"></style>
