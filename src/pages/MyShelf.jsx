import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getShelf } from '../lib/shelf.js'
import ShelfItemEditor from '../components/ShelfItemEditor.jsx'
import { useAuth } from '../utils/auth.js'
import { SHELF_STATUS } from '../utils/manga.js'

// หน้าชั้นหนังสือของฉัน (/shelf) — ต้องล็อกอินก่อน
function MyShelf() {
  const { user, loading } = useAuth()

  if (loading) return <p className="py-20 text-center text-slate-400">กำลังโหลด…</p>
  // ยังไม่ล็อกอิน → ไปหน้าเข้าสู่ระบบ แล้วพากลับมาหน้านี้
  if (!user) return <Navigate to="/login" state={{ from: '/shelf' }} replace />

  // key: เปลี่ยนผู้ใช้ = โหลดชั้นของคนใหม่
  return <Shelf key={user.id} />
}

function Shelf() {
  const [items, setItems] = useState(null) // null = กำลังโหลด
  const [error, setError] = useState('')
  const [tab, setTab] = useState('all')

  useEffect(() => {
    getShelf()
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  // แก้ 1 เรื่อง → แทนที่แถวนั้นในรายการ
  function handleChange(updated) {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
  }

  if (error) return <p className="rounded-lg bg-red-950 p-4 text-red-300">{error}</p>

  // แท็บ: ทั้งหมด + ทีละสถานะ พร้อมจำนวนเรื่อง
  const tabs = [
    { value: 'all', label: 'ทั้งหมด', count: items?.length ?? 0 },
    ...Object.entries(SHELF_STATUS).map(([value, { label, emoji }]) => ({
      value,
      label: `${emoji} ${label}`,
      count: items?.filter((item) => item.status === value).length ?? 0,
    })),
  ]
  const shown = items?.filter((item) => tab === 'all' || item.status === tab) ?? []

  return (
    <section>
      <h1 className="text-2xl font-bold sm:text-3xl">ชั้นหนังสือของฉัน</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(({ value, label, count }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              tab === value ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {label} <span className="opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {items === null ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-900" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p className="text-5xl">📚</p>
          <p className="mt-4">
            {items.length === 0 ? 'ชั้นหนังสือยังว่างอยู่' : 'ยังไม่มีเรื่องในหมวดนี้'}
          </p>
          <Link
            to="/search"
            className="mt-6 inline-block rounded-lg bg-rose-500 px-5 py-2 font-medium text-white hover:bg-rose-400"
          >
            ไปหามังงะเพิ่ม
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:p-4"
            >
              <Link to={`/manga/${item.manga_id}`} className="shrink-0">
                <img
                  src={item.cover_url}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[2/3] w-20 rounded-md bg-slate-800 object-cover sm:w-24"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/manga/${item.manga_id}`}
                  className="line-clamp-2 font-semibold hover:text-rose-400"
                >
                  {item.title}
                </Link>
                <div className="mt-3">
                  <ShelfItemEditor item={item} onChange={handleChange} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default MyShelf
