import { Routes, Route } from 'react-router-dom'
import AuthProvider from './components/AuthProvider.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import MangaDetail from './pages/MangaDetail.jsx'
import Search from './pages/Search.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Profile from './pages/Profile.jsx'
import MyShelf from './pages/MyShelf.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    // AuthProvider: ให้ทุกหน้ารู้ว่าใครล็อกอินอยู่
    <AuthProvider>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* กำหนดว่า URL ไหนจะแสดงหน้าไหน */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          {/* :id = ส่วนที่เปลี่ยนได้ เช่น /manga/30002 */}
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shelf" element={<MyShelf />} />
          {/* path="*" = URL อื่นๆ ที่ไม่ตรงกับข้างบน */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App
