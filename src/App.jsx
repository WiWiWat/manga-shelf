import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import MangaDetail from './pages/MangaDetail.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* กำหนดว่า URL ไหนจะแสดงหน้าไหน */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* :id = ส่วนที่เปลี่ยนได้ เช่น /manga/30002 */}
          <Route path="/manga/:id" element={<MangaDetail />} />
          {/* path="*" = URL อื่นๆ ที่ไม่ตรงกับข้างบน */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
