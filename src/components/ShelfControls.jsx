import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { addToShelf, getShelfItem, removeFromShelf } from '../lib/shelf.js'
import { useAuth } from '../utils/auth.js'
import { SHELF_STATUS } from '../utils/manga.js'
import ShelfItemEditor from './ShelfItemEditor.jsx'

// กล่อง "ชั้นหนังสือ" ในหน้ารายละเอียดมังงะ
//   ยังไม่ล็อกอิน      → ปุ่มไปเข้าสู่ระบบ
//   ยังไม่ได้เก็บเรื่องนี้ → ปุ่มเพิ่มเข้าชั้น 3 แบบ (ตามสถานะ)
//   เก็บแล้ว          → แก้สถานะ / ตอนที่อ่าน / เอาออกจากชั้น
function ShelfControls({ manga }) {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const userId = user?.id ?? null

  // ผลการโหลดพร้อม "ของใคร เรื่องไหน" — ไม่ตรงกับตอนนี้ = กำลังโหลด
  const loadKey = `${userId}|${manga.id}`
  const [result, setResult] = useState({ key: null, item: null, error: '' })
  const [busy, setBusy] = useState(false) // กำลังเพิ่ม/ลบ

  useEffect(() => {
    if (!userId) return
    let ignore = false
    getShelfItem(manga.id)
      .then((item) => !ignore && setResult({ key: loadKey, item, error: '' }))
      .catch((err) => !ignore && setResult({ key: loadKey, item: null, error: err.message }))
    return () => {
      ignore = true
    }
  }, [userId, manga.id, loadKey])

  const box = 'rounded-xl border border-slate-800 bg-slate-900 p-4'

  if (authLoading) return null

  if (!user) {
    return (
      <div className={`${box} flex flex-wrap items-center justify-between gap-3`}>
        <p className="text-sm text-slate-400">เข้าสู่ระบบเพื่อเก็บเรื่องนี้ไว้บนชั้นหนังสือ</p>
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    )
  }

  if (result.key !== loadKey) {
    return <div className={`${box} h-24 animate-pulse`} />
  }

  const { item, error } = result
  const setItem = (newItem) => setResult({ key: loadKey, item: newItem, error: '' })
  const setError = (message) => setResult((prev) => ({ ...prev, error: message }))

  async function handleAdd(status) {
    setBusy(true)
    try {
      setItem(await addToShelf(manga, status))
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  async function handleRemove() {
    if (!window.confirm('เอาเรื่องนี้ออกจากชั้นหนังสือ?')) return
    setBusy(true)
    try {
      await removeFromShelf(item.id)
      setItem(null)
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className={box}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-semibold">📚 ชั้นหนังสือของฉัน</h2>
        {item && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            className="text-sm text-slate-400 hover:text-red-400 disabled:opacity-50"
          >
            เอาออกจากชั้น
          </button>
        )}
      </div>

      {item ? (
        <ShelfItemEditor item={item} onChange={setItem} />
      ) : (
        <div className="flex flex-wrap gap-2">
          {Object.entries(SHELF_STATUS).map(([value, { label, emoji }]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAdd(value)}
              disabled={busy}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium transition hover:border-rose-400 hover:text-rose-400 disabled:cursor-wait disabled:opacity-50"
            >
              + {emoji} {label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default ShelfControls
