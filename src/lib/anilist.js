// ตัวช่วยเรียก AniList API — ใช้ฟรี ไม่ต้องมี key
// AniList ใช้ GraphQL: ส่ง "query" ไปบอกว่าอยากได้ข้อมูลช่องไหนบ้าง แล้วจะได้กลับมาแค่ช่องนั้น
// ข้อจำกัด: เรียกได้ประมาณ 30 ครั้ง/นาที ถ้าเกินจะได้ error 429
const API_URL = 'https://graphql.anilist.co'

async function request(query, variables = {}) {
  let res
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    // fetch พังตรงนี้ = ต่อเน็ตไม่ได้ หรือเข้าเว็บ AniList ไม่ได้
    throw new Error('เชื่อมต่อ AniList ไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่')
  }
  if (res.status === 429) {
    throw new Error('เรียกข้อมูลถี่เกินไป รอสักครู่แล้วลองใหม่')
  }
  // 404 = ไม่มีข้อมูลนี้ (เช่น id มังงะที่ไม่มีอยู่จริง) — ไม่ถือว่าพัง ให้หน้าเว็บจัดการเอง
  if (!res.ok && res.status !== 404) {
    throw new Error('โหลดข้อมูลไม่สำเร็จ')
  }
  const json = await res.json()
  return json.data
}

// ช่องข้อมูลที่การ์ดมังงะต้องใช้ — เขียนไว้ที่เดียว หน้าอื่นเอาไปใช้ซ้ำได้
const CARD_FIELDS = `
  id
  title { romaji english }
  coverImage { extraLarge }
  averageScore
  chapters
  format
  status
`

// มังงะคะแนนสูงสุด (isAdult: false = ไม่เอาเนื้อหาผู้ใหญ่)
export async function getTopManga(perPage = 24) {
  const query = `
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(type: MANGA, sort: SCORE_DESC, isAdult: false) {
          ${CARD_FIELDS}
        }
      }
    }
  `
  const data = await request(query, { perPage })
  return data.Page.media
}

// รายละเอียดมังงะ 1 เรื่อง — ถ้าไม่มี id นี้ (หรือเป็นเนื้อหาผู้ใหญ่) จะได้ null
export async function getMangaById(id) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        ${CARD_FIELDS}
        title { native }
        description(asHtml: false)
        genres
        volumes
        startDate { year }
        bannerImage
        isAdult
      }
    }
  `
  const data = await request(query, { id: Number(id) })
  const manga = data.Media
  if (!manga || manga.isAdult) return null
  return manga
}
