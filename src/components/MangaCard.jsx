import { Link } from 'react-router-dom'
import { FORMAT_LABELS, getTitle, getChapterText } from '../utils/manga.js'

// การ์ดมังงะ 1 เรื่อง: ปก + ชื่อ + คะแนน — กดแล้วไปหน้ารายละเอียด
function MangaCard({ manga }) {
  const title = getTitle(manga)

  return (
    <Link to={`/manga/${manga.id}`} className="group block">
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
        {FORMAT_LABELS[manga.format] || manga.format} · {getChapterText(manga)}
      </p>
    </Link>
  )
}

export default MangaCard
