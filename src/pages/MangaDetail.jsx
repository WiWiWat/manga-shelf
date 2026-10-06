import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMangaById } from '../lib/anilist.js'
import ShelfControls from '../components/ShelfControls.jsx'
import {
  FORMAT_LABELS,
  STATUS_LABELS,
  getTitle,
  cleanDescription,
} from '../utils/manga.js'

function MangaDetail() {
  // id มาจาก URL เช่น /manga/30002 → id = "30002"
  const { id } = useParams()
  // id ต้องเป็นตัวเลขเท่านั้น ถ้าไม่ใช่ก็ไม่ต้องเรียก API
  const validId = /^\d+$/.test(id)

  // เก็บผลลัพธ์พร้อม id ที่โหลด — ถ้า id ใน URL เปลี่ยน แปลว่ากำลังโหลดเรื่องใหม่
  const [result, setResult] = useState({ id: null, manga: null, error: '' })

  useEffect(() => {
    if (!validId) return
    getMangaById(id)
      .then((manga) => setResult({ id, manga, error: '' }))
      .catch((err) => setResult({ id, manga: null, error: err.message }))
  }, [id, validId])

  const loading = validId && result.id !== id
  // ใช้ผลลัพธ์เฉพาะเมื่อตรงกับ id ปัจจุบัน (กันข้อมูลเรื่องเก่าค้าง)
  const current = validId && result.id === id ? result : { manga: null, error: '' }
  const { manga, error } = current

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col gap-6 sm:flex-row">
        <div className="aspect-[2/3] w-48 shrink-0 rounded-lg bg-slate-800" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-2/3 rounded bg-slate-800" />
          <div className="h-4 w-1/3 rounded bg-slate-800" />
          <div className="h-24 rounded bg-slate-800" />
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="rounded-lg bg-red-950 p-4 text-red-300">{error}</p>
  }

  if (!manga) {
    return (
      <div className="py-20 text-center">
        <p className="text-6xl">📕</p>
        <h1 className="mt-4 text-2xl font-bold">ไม่พบมังงะเรื่องนี้</h1>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-rose-500 px-5 py-2 font-medium hover:bg-rose-400">
          กลับหน้าแรก
        </Link>
      </div>
    )
  }

  const title = getTitle(manga)
  const description = cleanDescription(manga.description)

  // ข้อมูลย่อยที่แสดงเป็นกล่องเล็กๆ
  const facts = [
    { label: 'คะแนน', value: manga.averageScore ? `★ ${manga.averageScore}%` : '-' },
    { label: 'ประเภท', value: FORMAT_LABELS[manga.format] || manga.format || '-' },
    { label: 'สถานะ', value: STATUS_LABELS[manga.status] || '-' },
    { label: 'จำนวนตอน', value: manga.chapters ? `${manga.chapters} ตอน` : '-' },
    { label: 'จำนวนเล่ม', value: manga.volumes ? `${manga.volumes} เล่ม` : '-' },
    { label: 'เริ่มตีพิมพ์', value: manga.startDate.year || '-' },
  ]

  return (
    <article>
      <Link to="/" className="text-sm text-slate-400 hover:text-rose-400">
        ← กลับหน้าแรก
      </Link>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:gap-8">
        <img
          src={manga.coverImage.extraLarge}
          alt={title}
          className="w-48 shrink-0 self-center rounded-lg shadow-lg sm:w-56 sm:self-start"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {manga.title.native && <p className="mt-1 text-slate-400">{manga.title.native}</p>}

          {/* หมวดของเรื่อง */}
          <div className="mt-4 flex flex-wrap gap-2">
            {manga.genres.map((genre) => (
              <span key={genre} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {genre}
              </span>
            ))}
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-lg bg-slate-900 p-3">
                <dt className="text-xs text-slate-400">{fact.label}</dt>
                <dd className="mt-0.5 font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            <ShelfControls manga={manga} />
          </div>

          <h2 className="mt-6 text-lg font-semibold">เรื่องย่อ</h2>
          {/* whitespace-pre-line = ขึ้นบรรทัดใหม่ตามข้อความจริง */}
          <p className="mt-2 leading-relaxed whitespace-pre-line text-slate-300">
            {description || 'ยังไม่มีเรื่องย่อ'}
          </p>
        </div>
      </div>
    </article>
  )
}

export default MangaDetail
