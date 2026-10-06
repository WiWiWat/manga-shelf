// กฎตรวจข้อมูลในฟอร์ม — คืนค่าเป็น object ของข้อความผิดพลาด เช่น { name: 'กรุณากรอกชื่อ' } (ว่าง = ผ่าน)

export function validateName(name) {
  return name.trim() ? {} : { name: 'กรุณากรอกชื่อ' }
}

export const MIN_PASSWORD_LENGTH = 8

// กฎตรวจอีเมลและรหัสผ่าน (หน้าสมัครสมาชิก / เข้าสู่ระบบ)
// checkPasswordLength = false สำหรับหน้าเข้าสู่ระบบ (แค่ห้ามว่าง ให้เซิร์ฟเวอร์ตัดสินว่าถูกไหม)
export function validateCredentials({ email, password }, { checkPasswordLength = true } = {}) {
  const errors = {}
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง เช่น name@example.com'
  }
  if (!password) {
    errors.password = 'กรุณากรอกรหัสผ่าน'
  } else if (checkPasswordLength && password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`
  }
  return errors
}

// กฎตรวจรหัสผ่านใหม่ (หน้าเปลี่ยนรหัสผ่าน / ตั้งรหัสผ่านใหม่): ยาวพอ และกรอก 2 ช่องตรงกัน
export function validateNewPassword({ password, confirm }) {
  const errors = {}
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`
  } else if (confirm !== password) {
    errors.confirm = 'รหัสผ่านทั้ง 2 ช่องไม่ตรงกัน'
  }
  return errors
}

// สไตล์ช่องกรอก: ถ้ามี error ขอบจะเป็นสีแดง
export function inputClass(hasError) {
  return `w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-base outline-none transition placeholder:text-slate-500 focus:ring-2 ${
    hasError
      ? 'border-red-500 focus:ring-red-500/30'
      : 'border-slate-700 focus:border-rose-400 focus:ring-rose-400/30'
  }`
}

// สไตล์ที่ใช้ซ้ำหลายหน้า
export const cardClass = 'rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6'
export const primaryButtonClass =
  'rounded-lg bg-rose-500 font-semibold text-white transition hover:bg-rose-400 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60'
export const errorBoxClass = 'rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300'
