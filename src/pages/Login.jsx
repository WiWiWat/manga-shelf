import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { authErrorMessage, useAuth } from '../utils/auth.js'
import {
  cardClass,
  errorBoxClass,
  inputClass,
  primaryButtonClass,
  validateCredentials,
} from '../utils/validation.js'

// หน้าเข้าสู่ระบบ (/login)
// ถ้าถูกส่งมาจากหน้าอื่น (state.from) เข้าสู่ระบบเสร็จจะพากลับไปหน้านั้น
function Login() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = location.state?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('') // error จาก Supabase เช่น รหัสผ่านผิด
  const [submitting, setSubmitting] = useState(false)

  // ล็อกอินอยู่แล้ว → ไม่ต้องอยู่หน้านี้
  if (user) return <Navigate to={from} replace />

  function handleEdit(field, value, setter) {
    setter(value)
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setServerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validateCredentials({ email, password }, { checkPasswordLength: false })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setSubmitting(false)
    if (error) {
      setServerError(authErrorMessage(error))
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-5 text-center text-2xl font-bold">เข้าสู่ระบบ</h1>

      <form onSubmit={handleSubmit} noValidate className={`space-y-5 ${cardClass}`}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">อีเมล</span>
          <input
            type="email"
            value={email}
            onChange={(e) => handleEdit('email', e.target.value, setEmail)}
            placeholder="name@example.com"
            autoComplete="email"
            className={inputClass(errors.email)}
          />
          {errors.email && <span className="mt-1 block text-sm text-red-400">{errors.email}</span>}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">รหัสผ่าน</span>
          <input
            type="password"
            value={password}
            onChange={(e) => handleEdit('password', e.target.value, setPassword)}
            autoComplete="current-password"
            className={inputClass(errors.password)}
          />
          {errors.password && (
            <span className="mt-1 block text-sm text-red-400">{errors.password}</span>
          )}
        </label>
        <p className="-mt-3 text-right text-sm">
          <Link to="/forgot-password" className="text-slate-400 hover:text-rose-400 hover:underline">
            ลืมรหัสผ่าน?
          </Link>
        </p>

        {serverError && (
          <p role="alert" className={errorBoxClass}>
            {serverError}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full py-3`}>
          {submitting ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        ยังไม่มีบัญชี?{' '}
        {/* ส่ง from ต่อไปด้วย สมัครเสร็จจะได้กลับไปหน้าเดิม */}
        <Link to="/signup" state={{ from }} className="font-semibold text-rose-400 hover:underline">
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  )
}

export default Login
