import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchManga } from '../lib/anilist.js'
import { GENRES } from '../utils/manga.js'
import MangaCard from '../components/MangaCard.jsx'

function Search() {
  // คำค้นหาและหมวดเก็บไว้ใน URL เช่น /search?q=one+piece&genre=Action
  // ข้อดี: กดย้อนกลับได้ และส่งลิงก์ผลการค้นหาให้คนอื่นได้
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const genre = searchParams.get('genre') || ''

  // ข้อความในช่องพิมพ์ (เปลี่ยนทุกครั้งที่กดแป้น)
  const [text, setText] = useState(q)

  // ถ้าคำค้นใน URL เปลี่ยนจากข้างนอก (เช่น กดย้อนกลับ) ให้ช่องพิมพ์เปลี่ยนตาม
  const [prevQ, setPrevQ] = useState(q)
  if (q !== prevQ) {
    setPrevQ(q)
    if (q !== text.trim()) setText(q)
  }

  // เก็บผลลัพธ์พร้อม "คำค้นที่ใช้" — ถ้าไม่ตรงกับคำค้นปัจจุบัน แปลว่ากำลังโหลด
  const searchKey = `${q}|${genre}`
  const [result, setResult] = useState({ key: null, list: [], error: '' })

  // พิมพ์เสร็จแล้วรอ 0.5 วินาทีค่อยค้นหา จะได้ไม่เรียก API ทุกตัวอักษร
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = text.trim()
      if (trimmed === q) return
      updateParams({ q: trimmed })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // คำค้นหรือหมวดใน URL เปลี่ยน → โหลดผลใหม่
  useEffect(() => {
    // ignore = ผลลัพธ์เก่าที่มาถึงช้า ไม่ต้องเอามาแสดงทับผลใหม่
    let ignore = false
    searchManga({ search: q, genre })
      .then((list) => !ignore && setResult({ key: searchKey, list, error: '' }))
      .catch((err) => !ignore && setResult({ key: searchKey, list: [], error: err.message }))
    return () => {
      ignore = true
    }
  }, [q, genre, searchKey])

  // แก้ค่าใน URL ทีละช่อง (ช่องที่ว่างจะถูกลบออกจาก URL)
  function updateParams(changes) {
    // อ่าน URL ล่าสุดจากเบราว์เซอร์ตรงๆ — ถ้าใช้ searchParams อาจได้ค่าเก่า
    // (เช่น ตัวจับเวลาพิมพ์ยังรออยู่ แล้วผู้ใช้กดเปลี่ยนหมวดไปก่อน หมวดจะถูกเขียนทับกลับ)
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  const loading = result.key !== searchKey

  let heading = 'มังงะยอดนิยม'
  if (q) heading = `ผลการค้นหา "${q}"`
  if (genre) heading += ` · หมวด${GENRES[genre] || genre}`

  return (
    <section>
      <h1 className="text-2xl font-bold sm:text-3xl">ค้นหามังงะ</h1>

      {/* พิมพ์แล้วค้นหาเองหลัง 0.5 วินาที หรือกด Enter / ปุ่ม "ค้นหา" เพื่อค้นทันที */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateParams({ q: text.trim() })
        }}
        className="mt-4 flex"
      >
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ค้นหามังงะ เช่น One Piece"
          autoFocus
          className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-700 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-rose-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-r-lg bg-rose-500 px-5 py-3 font-medium text-white hover:bg-rose-400"
        >
          ค้นหา
        </button>
      </form>

      {/* ปุ่มเลือกหมวด — กดซ้ำที่หมวดเดิมเพื่อยกเลิก */}
      <div className="mt-4 flex flex-wrap gap-2">
        <GenreButton active={!genre} onClick={() => updateParams({ genre: '' })}>
          ทุกหมวด
        </GenreButton>
        {Object.entries(GENRES).map(([value, label]) => (
          <GenreButton
            key={value}
            active={genre === value}
            onClick={() => updateParams({ genre: genre === value ? '' : value })}
          >
            {label}
          </GenreButton>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">{heading}</h2>

      {result.error && !loading && (
        <p className="mt-4 rounded-lg bg-red-950 p-4 text-red-300">{result.error}</p>
      )}

      {!loading && !result.error && result.list.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          <p className="text-5xl">🔍</p>
          <p className="mt-4">ไม่พบมังงะที่ตรงกับการค้นหา ลองเปลี่ยนคำค้นหรือหมวดดูนะ</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading
          ? Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-slate-800" />
            ))
          : result.list.map((manga) => <MangaCard key={manga.id} manga={manga} />)}
      </div>
    </section>
  )
}

// ปุ่มหมวด 1 อัน — สีชมพูเมื่อถูกเลือก
function GenreButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm transition ${
        active ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

export default Search
