import { createContext, useContext } from 'react'

// กล่องเก็บสถานะการล็อกอินที่ทุกหน้าใช้ร่วมกัน (ค่าจริงใส่โดย AuthProvider)
export const AuthContext = createContext(null)

// ใช้ใน component: ได้ { user, session, loading }
//   user    = ผู้ใช้ที่ล็อกอินอยู่ (null = ยังไม่ล็อกอิน)
//   loading = true ระหว่างเช็กว่าล็อกอินค้างไว้หรือเปล่า (ตอนเปิดเว็บครั้งแรก)
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth ต้องใช้ภายใน <AuthProvider>')
  return auth
}

// ชื่อที่แสดงในเว็บ: ชื่อที่กรอกตอนสมัคร ถ้าไม่มีใช้อีเมลแทน
export function getDisplayName(user) {
  return user?.user_metadata?.name || user?.email || ''
}

// ตัวอักษรแรกของชื่อสำหรับทำรูปวงกลม เช่น 'สมชาย' → 'ส'
// ข้ามสระที่เขียนไว้หน้าพยัญชนะ (เ แ โ ใ ไ) เช่น 'เอก' → 'อ'
export function getInitial(name) {
  return [...name.trim()].find((char) => !'เแโใไ'.includes(char)) ?? '?'
}

// แปล error จาก Supabase เป็นภาษาไทย (ดูจาก error.code ถ้าไม่รู้จักใช้ข้อความกลางๆ)
const AUTH_ERRORS = {
  invalid_credentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  user_already_exists: 'อีเมลนี้สมัครสมาชิกไว้แล้ว ลองเข้าสู่ระบบแทน',
  email_exists: 'อีเมลนี้สมัครสมาชิกไว้แล้ว ลองเข้าสู่ระบบแทน',
  weak_password: 'รหัสผ่านง่ายเกินไป กรุณาตั้งให้ยาวขึ้น',
  email_address_invalid: 'รูปแบบอีเมลไม่ถูกต้อง',
  email_not_confirmed: 'กรุณายืนยันอีเมลก่อน (เช็กกล่องจดหมายของคุณ)',
  over_request_rate_limit: 'ลองหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่',
  over_email_send_rate_limit: 'ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่',
  signup_disabled: 'ขณะนี้ปิดรับสมัครสมาชิกใหม่',
  same_password: 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม',
}

export function authErrorMessage(error) {
  return AUTH_ERRORS[error?.code] ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
}
