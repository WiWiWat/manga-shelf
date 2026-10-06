import { Link } from 'react-router-dom'

// หน้าข้อความกลางจอ: อีโมจิ + หัวข้อ + คำอธิบาย + ปุ่มไปหน้าอื่น
// ใช้หลายที่ เช่น "กรุณายืนยันอีเมล", "ลิงก์หมดอายุ"
function Notice({ emoji, title, children, linkTo, linkText, linkState }) {
  return (
    <div className="mx-auto max-w-sm px-2 py-16 text-center">
      <p className="text-5xl">{emoji}</p>
      <h1 className="mt-4 text-xl font-bold">{title}</h1>
      {children && <p className="mt-2 text-slate-400">{children}</p>}
      {linkTo && (
        <Link
          to={linkTo}
          state={linkState}
          className="mt-8 inline-block rounded-lg bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400"
        >
          {linkText}
        </Link>
      )}
    </div>
  )
}

export default Notice
