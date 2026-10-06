import { useEffect, useState } from 'react'
import { getTopManga } from '../lib/anilist.js'
import MangaCard from '../components/MangaCard.jsx'

function Home() {
  const [mangaList, setMangaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // โหลดมังงะยอดนิยมครั้งเดียวตอนเปิดหน้า
  useEffect(() => {
    getTopManga()
      .then(setMangaList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-bold sm:text-3xl">มังงะยอดนิยม</h1>
      <p className="mt-1 text-slate-400">จัดอันดับจากคะแนนบน AniList</p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-950 p-4 text-red-300">{error}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading
          ? // ระหว่างโหลด แสดงกล่องเทาๆ แทนการ์ด
            Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-slate-800" />
            ))
          : mangaList.map((manga) => <MangaCard key={manga.id} manga={manga} />)}
      </div>
    </section>
  )
}

export default Home
