// Format numeric values consistently across shop views and cart components.
export function formatMoney(amount) {
  const parsed = Number(amount)
  const value = Number.isFinite(parsed) ? parsed : 0
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatPopulation(population) {
  if (population === undefined || population === null || population === '') {
    return ''
  }
  const num = Number(population)
  return Number.isFinite(num) ? num.toLocaleString() : String(population)
}

export function gradeBadgeTone(grade) {
  const value = String(grade || '').toUpperCase()
  if (value.startsWith('PSA')) return 'red'
  if (value.startsWith('BGS')) return 'yellow'
  return 'blue'
}
