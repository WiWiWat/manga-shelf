import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import Notice from '../components/Notice.jsx'
import { authErrorMessage, useAuth } from '../utils/auth.js'
import {
  MIN_PASSWORD_LENGTH,
  cardClass,
  errorBoxClass,
  inputClass,
  primaryButtonClass,
  validateCredentials,
  validateName,
} from '../utils/validation.js'

// หน้าสมัครสมาชิก (/signup) — ชื่อเก็บไว้กับบัญชี (user_metadata)
function Signup() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from ?? '/'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // true = สมัครสำเร็จแต่ต้องยืนยันอีเมลก่อน (ถ้าเปิด Confirm email ใน Supabase)
  const [checkEmail, setCheckEmail] = useState(false)

  // ล็อกอินอยู่แล้ว → ไม่ต้องอยู่หน้านี้
  if (user) return <Navigate to={from} replace />

  function handleEdit(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setServerError('')
  }

  function validate() {
    const newErrors = { ...validateName(form.name), ...validateCredentials(form) }
    if (!newErrors.password && form.confirm !== form.password) {
      newErrors.confirm = 'รหัสผ่านทั้ง 2 ช่องไม่ตรงกัน'
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        // ข้อมูลเพิ่มเติมของบัญชี — อ่านได้ภายหลังจาก user.user_metadata
        data: { name: form.name.trim() },
        // ลิงก์ยืนยันในอีเมลพากลับมาเว็บที่สมัคร (เว็บจริง หรือ localhost ตอนพัฒนา)
        // ต้องอยู่ในรายการ Redirect URLs ของ Supabase ด้วย ไม่งั้นจะถูกพาไป Site URL แทน
        emailRedirectTo: window.location.origin,
      },
    })
    setSubmitting(false)
    if (error) {
      setServerError(authErrorMessage(error))
      return
    }
    // ปิดการยืนยันอีเมลไว้ → ได้ session ทันที = ล็อกอินแล้ว
    if (data.session) navigate(from, { replace: true })
    else setCheckEmail(true)
  }

  if (checkEmail) {
    return (
      <Notice
        emoji="📧"
        title="กรุณายืนยันอีเมล"
        linkTo="/login"
        linkState={{ from }}
        linkText="ไปหน้าเข้าสู่ระบบ"
      >
        เราส่งลิงก์ยืนยันไปที่ {form.email.trim()} แล้ว กดลิงก์ในอีเมลแล้วกลับมาเข้าสู่ระบบ
      </Notice>
    )
  }

  // ช่องกรอกทั้งหมด (วนสร้างจากรายการนี้ จะได้ไม่ต้องเขียนซ้ำ 4 รอบ)
  const fields = [
    { key: 'name', label: 'ชื่อ', type: 'text', placeholder: 'ชื่อที่จะแสดงในเว็บ', autoComplete: 'name' },
    { key: 'email', label: 'อีเมล', type: 'email', placeholder: 'name@example.com', autoComplete: 'email' },
    {
      key: 'password',
      label: 'รหัสผ่าน',
      type: 'password',
      autoComplete: 'new-password',
      hint: `อย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`,
    },
    { key: 'confirm', label: 'ยืนยันรหัสผ่าน', type: 'password', autoComplete: 'new-password' },
  ]

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-5 text-center text-2xl font-bold">สมัครสมาชิก</h1>

      <form onSubmit={handleSubmit} noValidate className={`space-y-5 ${cardClass}`}>
        {fields.map(({ key, label, hint, ...inputProps }) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm font-semibold">{label}</span>
            <input
              {...inputProps}
              value={form[key]}
              onChange={(e) => handleEdit(key, e.target.value)}
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

        <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full py-3`}>
          {submitting ? 'กำลังสมัคร…' : 'สมัครสมาชิก'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        มีบัญชีแล้ว?{' '}
        <Link to="/login" state={{ from }} className="font-semibold text-rose-400 hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  )
}

export default Signup
