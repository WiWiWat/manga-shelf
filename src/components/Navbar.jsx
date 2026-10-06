import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">
          📚 Manga<span className="text-rose-400">Shelf</span>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
