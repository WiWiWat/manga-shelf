import { createClient } from '@supabase/supabase-js'

// ค่าเชื่อมต่อมาจากไฟล์ .env.local (ดูตัวอย่างใน .env.example)
// Vite ให้อ่านได้เฉพาะตัวแปรที่ขึ้นต้นด้วย VITE_ ผ่าน import.meta.env
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// ลืมตั้งค่า → บอกให้ชัดว่าต้องทำอะไร แทนที่จะไปเจอ error งงๆ ทีหลัง
if (!url || !publishableKey) {
  throw new Error(
    'ยังไม่ได้ตั้งค่า Supabase: คัดลอก .env.example เป็น .env.local ใส่ค่าจริง แล้วรัน npm run dev ใหม่',
  )
}

// ตัวเชื่อมต่อ Supabase ตัวเดียวที่ทั้งเว็บใช้ร่วมกัน (ฐานข้อมูล + ระบบล็อกอิน)
export const supabase = createClient(url, publishableKey)
