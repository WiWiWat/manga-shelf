import { useState } from 'react'
import NewPasswordForm from '../components/NewPasswordForm.jsx'
import Notice from '../components/Notice.jsx'
import { useAuth } from '../utils/auth.js'
import { cardClass } from '../utils/validation.js'

// อ่าน error ที่ Supabase แนบมากับลิงก์ เช่น #error_code=otp_expired (ลิงก์หมดอายุ/ใช้ไปแล้ว)
function readLinkError() {
  const hash = new URLSearchParams(window.location.hash.slice(1))
  const query = new URLSearchParams(window.location.search)
  return hash.get('error_code') ?? query.get('error_code')
}

// หน้าตั้งรหัสผ่านใหม่ (/reset-password) — มาจากการกดลิงก์ "ลืมรหัสผ่าน" ในอีเมล
// ลิงก์ในอีเมลจะล็อกอินให้ชั่วคราว (Supabase จัดการให้) แล้วหน้านี้ให้ตั้งรหัสผ่านใหม่
function ResetPassword() {
  const { user, loading } = useAuth()
  // อ่านครั้งเดียวตอนเปิดหน้า (Supabase อาจล้างข้อมูลใน URL ทิ้งหลังอ่านเสร็จ)
  const [linkError] = useState(readLinkError)
  const [done, setDone] = useState(false)

  if (loading) return <p className="py-20 text-center text-slate-400">กำลังตรวจสอบลิงก์…</p>

  // ลิงก์ผิด/หมดอายุ หรือเปิดหน้านี้ตรงๆ โดยไม่ได้มาจากอีเมล
  if (linkError || !user) {
    return (
      <Notice
        emoji="⏰"
        title="ลิงก์หมดอายุหรือใช้ไม่ได้แล้ว"
        linkTo="/forgot-password"
        linkText="ขอลิงก์ใหม่"
      >
        ลิงก์ตั้งรหัสผ่านใหม่ใช้ได้ครั้งเดียวและมีเวลาจำกัด กรุณาขอลิงก์ใหม่
      </Notice>
    )
  }

  if (done) {
    return (
      <Notice emoji="✅" title="ตั้งรหัสผ่านใหม่เรียบร้อย" linkTo="/" linkText="ไปหน้าแรก">
        ครั้งหน้าใช้รหัสผ่านใหม่เข้าสู่ระบบได้เลย
      </Notice>
    )
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">ตั้งรหัสผ่านใหม่</h1>
      <p className="mb-5 text-center text-sm text-slate-400">สำหรับบัญชี {user.email}</p>
      <div className={cardClass}>
        <NewPasswordForm submitLabel="ตั้งรหัสผ่านใหม่" onDone={() => setDone(true)} />
      </div>
    </div>
  )
}

export default ResetPassword
