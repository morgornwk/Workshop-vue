export const ALLOWED_IMAGE_RE = /\.(jpe?g|png|webp)$/i
export const MAX_SOURCE_BYTES = 15 * 1024 * 1024
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
export const PREVIEW_BACKDROP = 'linear-gradient(135deg,#334155,#64748b)'

export function validateImageFile(file) {
    if (!ALLOWED_IMAGE_RE.test(file.name)) {
        return 'รองรับเฉพาะไฟล์รูป JPG, JPEG, PNG และ WEBP'
    }
    if (file.size > MAX_SOURCE_BYTES) {
        return 'ไฟล์ต้นฉบับต้องมีขนาดไม่เกิน 15 MB'
    }
    return ''
}

export function parseProductPayload(form) {
    if (!form.name.trim()) {
        return { error: 'กรุณากรอกชื่อสินค้า' }
    }

    const price = Number(form.price)
    if (form.price === '' || !Number.isFinite(price) || price < 0) {
        return { error: 'กรุณากรอกราคาให้ถูกต้อง (มากกว่าหรือเท่ากับ 0)' }
    }

    const stock = form.stock === '' ? 0 : Number(form.stock)
    if (!Number.isFinite(stock) || stock < 0) {
        return { error: 'กรุณากรอกจำนวนสินค้าให้ถูกต้อง' }
    }

    return {
        payload: {
        name: form.name.trim(),
        set_name: form.set_name.trim(),
        card_number: form.card_number.trim(),
        grade: form.grade.trim(),
        population: form.population.trim(),
        description: form.description.trim(),
        price: Math.round(price),
        stock: Math.floor(stock),
        image: form.image,
        },
    }
}