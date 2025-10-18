"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const isTV = pathname?.startsWith('/tv')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-xl shadow-xl' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tight hover:opacity-80 transition flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-fuchsia-600 flex items-center justify-center">
            <span className="text-white text-lg">S</span>
          </div>
          <span className="hidden sm:inline">
            <span className="text-[var(--accent)]">STREAM</span><span className="text-white">PARADISE</span>
          </span>
        </Link>
        
        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          <li><Link href="/" className="hover:text-[var(--accent)] transition">Movies</Link></li>
          <li><Link href="/tv" className="hover:text-[var(--accent)] transition">TV Shows</Link></li>
        </ul>
        
        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form action={isTV ? "/tv" : "/"} method="GET" className="flex items-center gap-2">
                <input 
                  name="q" 
                  autoFocus
                  placeholder={isTV ? "Search TV shows..." : "Search movies..."} 
                  className="w-48 sm:w-64 rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm outline-none placeholder-white/40 focus:bg-white/15 focus:border-[var(--accent)] transition" 
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                />
              </form>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Profile */}
          <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-fuchsia-600 flex items-center justify-center font-bold text-white hover:opacity-90 transition-all">
            U
          </button>
        </div>
      </nav>
    </header>
  )
}