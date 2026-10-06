import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { authErrorMessage } from '../utils/auth.js'
import {
  MIN_PASSWORD_LENGTH,
  errorBoxClass,
  inputClass,
  primaryButtonClass,
  validateNewPassword,
} from '../utils/validation.js'

// ฟอร์มตั้งรหัสผ่านใหม่ (ใช้ทั้งหน้าบัญชี และหน้าตั้งรหัสผ่านใหม่หลังกดลิงก์จากอีเมล)
// ต้องล็อกอินอยู่ (ลิงก์ "ลืมรหัสผ่าน" ในอีเมลจะล็อกอินให้ชั่วคราว)
// props: submitLabel = ข้อความบนปุ่ม, onDone = เรียกเมื่อเปลี่ยนสำเร็จ
function NewPasswordForm({ submitLabel, onDone }) {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  function handleEdit(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setServerError('')
    setDone(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validateNewPassword(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: form.password })
    setSaving(false)
    if (error) {
      setServerError(authErrorMessage(error))
      return
    }
    setForm({ password: '', confirm: '' }) // ล้างช่อง ไม่เก็บรหัสผ่านค้างไว้บนหน้าจอ
    setDone(true)
    onDone?.()
  }

  const fields = [
    { key: 'password', label: 'รหัสผ่านใหม่', hint: `อย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร` },
    { key: 'confirm', label: 'ยืนยันรหัสผ่านใหม่' },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {fields.map(({ key, label, hint }) => (
        <label key={key} className="block">
          <span className="mb-2 block text-sm font-semibold">{label}</span>
          <input
            type="password"
            value={form[key]}
            onChange={(e) => handleEdit(key, e.target.value)}
            autoComplete="new-password"
            className={inputClass(errors[key])}
          />
          {errors[key] ? (
            <span className="mt-1 block text-sm text-red-400">{errors[key]}</span>
          ) : (
            hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>
          )}
        </label>
      ))}

      {serverError && (
        <p role="alert" className={errorBoxClass}>
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className={`${primaryButtonClass} px-6 py-2.5`}>
          {saving ? 'กำลังบันทึก…' : submitLabel}
        </button>
        {done && (
          <span role="status" className="text-sm font-medium text-emerald-400">
            เปลี่ยนรหัสผ่านแล้ว ✓
          </span>
        )}
      </div>
    </form>
  )
}

export default NewPasswordForm
