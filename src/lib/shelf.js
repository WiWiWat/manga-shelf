import { supabase } from './supabase.js'
import { getTitle } from '../utils/manga.js'

// ตัวช่วยอ่าน/เขียนตาราง shelf_items (ชั้นหนังสือของผู้ใช้ที่ล็อกอินอยู่)
// ไม่ต้องกรองด้วย user_id เอง — กฎ RLS ในฐานข้อมูลให้เห็นแค่แถวของตัวเองอยู่แล้ว

// error จาก Supabase → ข้อความภาษาไทยกลางๆ
function check({ data, error }) {
  if (error) throw new Error('ติดต่อฐานข้อมูลไม่สำเร็จ ลองใหม่อีกครั้ง')
  return data
}

// ทั้งชั้น เรียงจากที่แก้ล่าสุด
export async function getShelf() {
  return check(
    await supabase.from('shelf_items').select('*').order('updated_at', { ascending: false }),
  )
}

// มังงะ 1 เรื่องบนชั้น (null = ยังไม่ได้เก็บ)
export async function getShelfItem(mangaId) {
  return check(await supabase.from('shelf_items').select('*').eq('manga_id', mangaId).maybeSingle())
}

// เพิ่มมังงะ (ข้อมูลจาก AniList) เข้าชั้นด้วยสถานะที่เลือก
export async function addToShelf(manga, status) {
  const row = {
    manga_id: manga.id,
    title: getTitle(manga),
    cover_url: manga.coverImage.extraLarge,
    total_chapters: manga.chapters,
    status,
    // เพิ่มเป็น "อ่านจบ" → ถือว่าอ่านครบทุกตอน
    progress: status === 'completed' && manga.chapters ? manga.chapters : 0,
  }
  return check(await supabase.from('shelf_items').insert(row).select().single())
}

// แก้สถานะ / ตอนที่อ่าน — changes เช่น { progress: 12 }
export async function updateShelfItem(id, changes) {
  return check(await supabase.from('shelf_items').update(changes).eq('id', id).select().single())
}

export async function removeFromShelf(id) {
  check(await supabase.from('shelf_items').delete().eq('id', id))
}
