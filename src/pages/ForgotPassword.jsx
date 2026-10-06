import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import Notice from '../components/Notice.jsx'
import { authErrorMessage } from '../utils/auth.js'
import {
  cardClass,
  errorBoxClass,
  inputClass,
  primaryButtonClass,
  validateCredentials,
} from '../utils/validation.js'

// error ที่ควรบอกผู้ใช้ตรงๆ (ส่งบ่อยเกินไป) — error อื่นจะแสดงข้อความ "ส่งแล้ว" เหมือนกันหมด
const RATE_LIMIT_ERRORS = ['over_email_send_rate_limit', 'over_request_rate_limit']

// หน้าลืมรหัสผ่าน (/forgot-password): กรอกอีเมล → Supabase ส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้
function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [serverError, setServerError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    // ใช้กฎตรวจอีเมลตัวเดียวกับหน้าเข้าสู่ระบบ (ไม่สนช่องรหัสผ่าน)
    const { email: error } = validateCredentials({ email, password: 'x' })
    setEmailError(error ?? '')
    if (error) return

    setSending(true)
    const { error: sendError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      // กดลิงก์ในอีเมลแล้วมาที่หน้าตั้งรหัสผ่านใหม่ของเว็บนี้ (ต้องอยู่ใน Redirect URLs ของ Supabase)
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSending(false)
    if (RATE_LIMIT_ERRORS.includes(sendError?.code)) {
      setServerError(authErrorMessage(sendError))
      return
    }
    // ไม่บอกว่าอีเมลนี้มีบัญชีหรือไม่ — กันคนอื่นใช้หน้านี้เดาว่าอีเมลไหนสมัครไว้
    setSent(true)
  }

  if (sent) {
    return (
      <Notice emoji="📧" title="เช็กอีเมลของคุณ" linkTo="/login" linkText="กลับไปหน้าเข้าสู่ระบบ">
        ถ้า {email.trim()} มีบัญชีอยู่ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปแล้ว
        (ถ้าไม่เจอ ลองดูในโฟลเดอร์จดหมายขยะ)
      </Notice>
    )
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">ลืมรหัสผ่าน</h1>
      <p className="mb-5 text-center text-sm text-slate-400">
        กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
      </p>

      <form onSubmit={handleSubmit} noValidate className={`space-y-5 ${cardClass}`}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">อีเมล</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
              setServerError('')
            }}
            placeholder="name@example.com"
            autoComplete="email"
            className={inputClass(emailError)}
          />
          {emailError && <span className="mt-1 block text-sm text-red-400">{emailError}</span>}
        </label>

        {serverError && (
          <p role="alert" className={errorBoxClass}>
            {serverError}
          </p>
        )}

        <button type="submit" disabled={sending} className={`${primaryButtonClass} w-full py-3`}>
          {sending ? 'กำลังส่ง…' : 'ส่งลิงก์ตั้งรหัสผ่านใหม่'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        นึกออกแล้ว?{' '}
        <Link to="/login" className="font-semibold text-rose-400 hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  )
}

export default ForgotPassword
