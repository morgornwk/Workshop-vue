<template>
  <div class="grade-wrap">
    <v-card class="grade-card" elevation="2">
      <div class="grade-head">
        <v-icon color="#f97316" class="mr-2">mdi-calculator-variant-outline</v-icon>
        <span class="text-h6 font-weight-bold">คำนวณเกรด</span>
      </div>

      <v-form ref="formRef" @submit.prevent="calculate">
        <v-text-field
          v-model="score"
          label="คะแนน (0 - 100)"
          :rules="rules"
          outlined
          dense
          color="#f97316"
        />

        <v-btn block color="#f97316" dark depressed type="submit">
          ตัดเกรด
        </v-btn>
      </v-form>

      <div v-if="grade" class="grade-result" :class="`grade--${grade.toLowerCase()}`">
        เกรด: <strong>{{ grade }}</strong>
      </div>
    </v-card>
  </div>
</template>

<script>
import { useGradeCalculator } from '@/hook/useGradeCalculator'

export default {
  name: 'GradeView',
  setup() {
    return useGradeCalculator()
  },
}
</script>

<style scoped src="../assets/style/grade-calculator.css"></style>
