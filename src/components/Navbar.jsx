import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getDisplayName, getInitial, useAuth } from '../utils/auth.js'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const [text, setText] = useState('')

  // หน้าค้นหามีช่องค้นหาของตัวเองอยู่แล้ว — ไม่ต้องแสดงซ้ำที่แถบด้านบน
  const onSearchPage = location.pathname === '/search'

  // กด Enter หรือกดปุ่ม "ค้นหา" → ไปหน้าค้นหาพร้อมคำที่พิมพ์
  function handleSubmit(e) {
    e.preventDefault()
    const q = text.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    setText('')
  }

  const displayName = getDisplayName(user)

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4">
        <Link to="/" className="shrink-0 text-lg font-bold sm:text-xl">
          📚 Manga<span className="text-rose-400">Shelf</span>
        </Link>

        {/* ml-auto ดันทุกอย่างหลังจากนี้ไปชิดขวา */}
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3">
          {!onSearchPage && (
            <form onSubmit={handleSubmit} className="flex min-w-0 max-w-sm flex-1">
              <input
                type="search"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ค้นหามังงะ"
                className="w-0 min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none placeholder:text-slate-500 focus:border-rose-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-r-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-400 sm:px-4"
              >
                ค้นหา
              </button>
            </form>
          )}

          {/* บัญชี: ล็อกอินแล้ว = วงกลมตัวอักษรแรกของชื่อ / ยังไม่ล็อกอิน = ปุ่มเข้าสู่ระบบ
              (ระหว่างเช็กสถานะตอนเปิดเว็บ ยังไม่แสดงอะไร กันปุ่มกระพริบ) */}
          {loading ? null : user ? (
            <Link
              to="/profile"
              aria-label={`บัญชีของ ${displayName}`}
              title={displayName}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white transition hover:bg-rose-400"
            >
              {getInitial(displayName)}
            </Link>
          ) : (
            // ส่งหน้าปัจจุบันไปด้วย เข้าสู่ระบบเสร็จจะได้กลับมาหน้านี้
            <Link
              to="/login"
              state={{ from: location.pathname + location.search }}
              aria-label="เข้าสู่ระบบ"
              className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 sm:px-3"
            >
              <span aria-hidden="true">👤</span>
              <span className="hidden sm:inline"> เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
