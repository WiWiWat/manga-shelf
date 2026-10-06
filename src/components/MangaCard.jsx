// แปลงประเภทจาก AniList เป็นคำที่อ่านง่าย
const FORMAT_LABELS = {
  MANGA: 'มังงะ',
  NOVEL: 'นิยาย',
  ONE_SHOT: 'ตอนเดียวจบ',
}

// การ์ดมังงะ 1 เรื่อง: ปก + ชื่อ + คะแนน
function MangaCard({ manga }) {
  // ใช้ชื่อภาษาอังกฤษถ้ามี ไม่มีก็ใช้ชื่อญี่ปุ่นแบบตัวอักษรโรมัน
  const title = manga.title.english || manga.title.romaji

  let chapterText = '-'
  if (manga.chapters) chapterText = `${manga.chapters} ตอน`
  else if (manga.status === 'RELEASING') chapterText = 'ยังไม่จบ'

  return (
    <div className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-slate-800">
        <img
          src={manga.coverImage.extraLarge}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* AniList ให้คะแนนเต็ม 100 */}
        {manga.averageScore && (
          <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-sm font-semibold text-amber-300">
            ★ {manga.averageScore}%
          </span>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium group-hover:text-rose-400">
        {title}
      </h3>
      <p className="text-xs text-slate-400">
        {FORMAT_LABELS[manga.format] || manga.format} · {chapterText}
      </p>
    </div>
  )
}

export default MangaCard
