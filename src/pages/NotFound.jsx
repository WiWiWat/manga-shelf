import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl">🤔</p>
      <h1 className="mt-4 text-2xl font-bold">ไม่พบหน้านี้</h1>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-rose-500 px-5 py-2 font-medium hover:bg-rose-400">
        กลับหน้าแรก
      </Link>
    </div>
  )
}

export default NotFound
