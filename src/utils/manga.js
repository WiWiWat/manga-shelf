// ตัวช่วยแปลงข้อมูลมังงะจาก AniList ให้อ่านง่าย — ใช้ร่วมกันหลายหน้า

// ประเภทของเรื่อง
export const FORMAT_LABELS = {
  MANGA: 'มังงะ',
  NOVEL: 'นิยาย',
  ONE_SHOT: 'ตอนเดียวจบ',
}

// สถานะการตีพิมพ์
export const STATUS_LABELS = {
  FINISHED: 'จบแล้ว',
  RELEASING: 'ยังไม่จบ',
  NOT_YET_RELEASED: 'ยังไม่เริ่ม',
  CANCELLED: 'ยกเลิก',
  HIATUS: 'พักการตีพิมพ์',
}

// ใช้ชื่อภาษาอังกฤษถ้ามี ไม่มีก็ใช้ชื่อญี่ปุ่นแบบตัวอักษรโรมัน
export function getTitle(manga) {
  return manga.title.english || manga.title.romaji
}

// ข้อความจำนวนตอน เช่น "95 ตอน" หรือ "ยังไม่จบ"
export function getChapterText(manga) {
  if (manga.chapters) return `${manga.chapters} ตอน`
  if (manga.status === 'RELEASING') return 'ยังไม่จบ'
  return '-'
}

// เรื่องย่อจาก AniList มีแท็ก HTML ปนมา (<br>, <i>) — เอาออกให้เหลือแต่ข้อความ
export function cleanDescription(text) {
  if (!text) return ''
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
