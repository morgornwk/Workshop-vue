<template>
    <div class="grade-wrap">
        <v-card class="grade-card" elevation="2">
        <div class="grade-head">
            <v-icon color="#f97316" class="mr-2">mdi-calculator-variant-outline</v-icon>
            <span class="text-h6 font-weight-bold">คำนวณเกรด</span>
        </div>

        <v-form ref="form" @submit.prevent="cal">
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
export default {
    name: 'GradeView',
    data: () => ({
        score: '',
        grade: null,
        rules: [
            v => !!v || 'กรุณากรอกคะแนน',
            v => !isNaN(v) || 'กรุณากรอกเฉพาะตัวเลข',
            v => (v >= 0 && v <= 100) || 'คะแนนต้องอยู่ระหว่าง 0-100'
        ]
    }),
    methods: {
        cal() {
            if (!this.$refs.form.validate()) {
                this.grade = null
                return
            }

            const score = Number(this.score)
            if (score >= 80) this.grade = 'A'
            else if (score >= 70) this.grade = 'B'
            else if (score >= 60) this.grade = 'C'
            else if (score >= 50) this.grade = 'D'
            else this.grade = 'F'
        }
    }
}
</script>

<style scoped src="../assets/style/calculate.css"></style>