import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { AuthContext } from '../utils/auth.js'

// ครอบทั้งเว็บไว้ เพื่อให้ทุกหน้ารู้ว่าตอนนี้ใครล็อกอินอยู่ (เรียกใช้ด้วย useAuth())
function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1) ตอนเปิดเว็บ: เช็กว่าเคยล็อกอินค้างไว้ไหม (Supabase จำไว้ให้ในเบราว์เซอร์)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 2) หลังจากนั้น: รอฟังทุกครั้งที่ล็อกอิน / ออกจากระบบ / ข้อมูลบัญชีเปลี่ยน
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const value = { session, user: session?.user ?? null, loading }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
