import { ref } from 'vue'

export function useGradeCalculator() {
  const formRef = ref(null)
  const score = ref('')
  const grade = ref(null)

  const rules = [
    (v) => !!v || 'กรุณากรอกคะแนน',
    (v) => !isNaN(v) || 'กรุณากรอกเฉพาะตัวเลข',
    (v) => (v >= 0 && v <= 100) || 'คะแนนต้องอยู่ระหว่าง 0-100',
  ]

  function calculate() {
    if (!formRef.value || !formRef.value.validate()) {
      grade.value = null
      return
    }

    const num = Number(score.value)
    if (num >= 80) grade.value = 'A'
    else if (num >= 70) grade.value = 'B'
    else if (num >= 60) grade.value = 'C'
    else if (num >= 50) grade.value = 'D'
    else grade.value = 'F'
  }

  return {
    formRef,
    score,
    grade,
    rules,
    calculate,
  }
}
