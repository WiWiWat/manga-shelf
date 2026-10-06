import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import NewPasswordForm from '../components/NewPasswordForm.jsx'
import { authErrorMessage, getDisplayName, getInitial, useAuth } from '../utils/auth.js'
import {
  cardClass,
  errorBoxClass,
  inputClass,
  primaryButtonClass,
  validateName,
} from '../utils/validation.js'

// หน้าบัญชีของฉัน (/profile) — ต้องล็อกอินก่อน
function Profile() {
  const { user, loading } = useAuth()

  if (loading) return <p className="py-20 text-center text-slate-400">กำลังโหลด…</p>
  // ยังไม่ล็อกอิน → ไปหน้าเข้าสู่ระบบ แล้วพากลับมาหน้านี้
  if (!user) return <Navigate to="/login" state={{ from: '/profile' }} replace />

  // key: เปลี่ยนผู้ใช้ = เริ่มฟอร์มใหม่ด้วยข้อมูลของคนใหม่
  return <Account key={user.id} user={user} />
}

function Account({ user }) {
  const navigate = useNavigate()
  // ค่าเริ่มต้นมาจากข้อมูลบัญชี (กรอกไว้ตอนสมัคร)
  const [name, setName] = useState(user.user_metadata?.name ?? '')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false) // แสดง "บันทึกแล้ว ✓" หลังบันทึกสำเร็จ

  async function handleSubmit(e) {
    e.preventDefault()
    const { name: nameError } = validateName(name)
    setError(nameError ?? '')
    if (nameError) return

    setSaving(true)
    // บันทึกลงบัญชี Supabase → เมนูด้านบนจะอัปเดตชื่อเอง (AuthProvider ได้รับแจ้ง)
    const { error: saveError } = await supabase.auth.updateUser({ data: { name: name.trim() } })
    setSaving(false)
    if (saveError) {
      setServerError(authErrorMessage(saveError))
      return
    }
    setName(name.trim())
    setSaved(true)
  }

  async function handleLogout() {
    // ไปหน้าแรกก่อน แล้วค่อยออกจากระบบ
    // (ถ้าออกก่อน หน้านี้จะเห็นว่าไม่ได้ล็อกอินแล้วเด้งไปหน้าเข้าสู่ระบบแทน)
    navigate('/')
    await supabase.auth.signOut()
  }

  const displayName = getDisplayName(user)

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">บัญชีของฉัน</h1>

      <section className={cardClass}>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-rose-500 text-2xl font-bold text-white">
            {getInitial(displayName)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{displayName}</p>
            <p className="truncate text-sm text-slate-400">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">ชื่อ</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
                setServerError('')
                setSaved(false)
              }}
              autoComplete="name"
              className={inputClass(error)}
            />
            {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
          </label>

          {serverError && (
            <p role="alert" className={errorBoxClass}>
              {serverError}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className={`${primaryButtonClass} px-6 py-2.5`}>
              {saving ? 'กำลังบันทึก…' : 'บันทึก'}
            </button>
            {saved && (
              <span role="status" className="text-sm font-medium text-emerald-400">
                บันทึกแล้ว ✓
              </span>
            )}
          </div>
        </form>
      </section>

      <section className={cardClass}>
        <h2 className="mb-4 text-lg font-semibold">เปลี่ยนรหัสผ่าน</h2>
        <NewPasswordForm submitLabel="เปลี่ยนรหัสผ่าน" />
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-lg border border-slate-700 py-3 font-semibold text-slate-300 transition hover:border-red-500 hover:text-red-400"
      >
        ออกจากระบบ
      </button>
    </div>
  )
}

export default Profile
