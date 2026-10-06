import { useState } from 'react'
import { updateShelfItem } from '../lib/shelf.js'
import { SHELF_STATUS, progressForStatus } from '../utils/manga.js'

// แก้สถานะ + ตอนที่อ่าน ของมังงะ 1 เรื่องบนชั้น
// ใช้ทั้งหน้ารายละเอียด และหน้าชั้นหนังสือ
// props: item = แถวจาก shelf_items, onChange(itemใหม่) = แจ้งหน้าแม่ว่าข้อมูลเปลี่ยน
function ShelfItemEditor({ item, onChange }) {
  const [error, setError] = useState('')
  const total = item.total_chapters

  // อัปเดตหน้าจอทันที แล้วค่อยบันทึก (กดรัวๆ ได้ไม่ต้องรอ)
  // ถ้าบันทึกไม่สำเร็จ → ย้อนกลับเป็นค่าเดิม และบอกผู้ใช้
  async function save(changes) {
    const before = item
    setError('')
    onChange({ ...item, ...changes })
    try {
      await updateShelfItem(item.id, changes)
    } catch (err) {
      onChange(before)
      setError(err.message)
    }
  }

  function changeStatus(status) {
    if (status === item.status) return
    save({ status, progress: progressForStatus(item, status) })
  }

  function changeProgress(progress) {
    // ไม่ให้ต่ำกว่า 0 และไม่เกินจำนวนตอนทั้งหมด (ถ้ารู้)
    const next = Math.max(0, total ? Math.min(progress, total) : progress)
    if (next === item.progress) return
    const changes = { progress: next }
    // อ่านตอนแรกของเรื่องที่ "อยากอ่าน" → เปลี่ยนเป็น "กำลังอ่าน" ให้เอง
    if (item.status === 'planned' && next > 0) changes.status = 'reading'
    // อ่านครบทุกตอน → "อ่านจบ" ให้เอง
    if (total && next === total) changes.status = 'completed'
    save(changes)
  }

  return (
    <div className="space-y-3">
      {/* ปุ่มสถานะ 3 อัน — อันที่เลือกอยู่เป็นสีชมพู */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SHELF_STATUS).map(([value, { label, emoji }]) => (
          <button
            key={value}
            type="button"
            onClick={() => changeStatus(value)}
            aria-pressed={item.status === value}
            className={`rounded-full px-3 py-1 text-sm transition ${
              item.status === value
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* ตอนที่อ่าน: − ตัวเลข + */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">อ่านถึงตอน</span>
        <div className="flex items-center overflow-hidden rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => changeProgress(item.progress - 1)}
            disabled={item.progress === 0}
            aria-label="ลดตอนที่อ่าน 1 ตอน"
            className="px-3 py-1 text-lg hover:bg-slate-800 disabled:opacity-30"
          >
            −
          </button>
          <span className="min-w-16 px-2 text-center font-semibold tabular-nums">
            {item.progress}
            {total && <span className="font-normal text-slate-400"> / {total}</span>}
          </span>
          <button
            type="button"
            onClick={() => changeProgress(item.progress + 1)}
            disabled={total !== null && item.progress >= total}
            aria-label="เพิ่มตอนที่อ่าน 1 ตอน"
            className="px-3 py-1 text-lg hover:bg-slate-800 disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      {/* แถบความคืบหน้า (แสดงเฉพาะเรื่องที่รู้จำนวนตอน) */}
      {total && (
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-rose-500 transition-all"
            style={{ width: `${(item.progress / total) * 100}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}

export default ShelfItemEditor
