import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
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

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 text-lg font-bold sm:text-xl">
          📚 Manga<span className="text-rose-400">Shelf</span>
        </Link>

        {!onSearchPage && (
          <form onSubmit={handleSubmit} className="ml-auto flex min-w-0 max-w-sm flex-1">
            <input
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ค้นหามังงะ"
              className="w-0 min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-700 bg-slate-900 px-3 py-1.5 text-sm outline-none placeholder:text-slate-500 focus:border-rose-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-r-lg bg-rose-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-400"
            >
              ค้นหา
            </button>
          </form>
        )}
      </nav>
    </header>
  )
}

export default Navbar
