'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/payload-types'
import AuthModal from '../AuthModal'

interface HeaderProps {
  isApp?: boolean
  initialUser?: User | null
}

export default function Header({ isApp = false, initialUser = null }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const user = initialUser

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }

  return (
    <header
      className={
        isApp
          ? 'flex items-center justify-between px-6 py-3 mx-4 my-2 bg-transparent border-none shadow-none rounded-xl'
          : 'flex items-center justify-between px-8 py-6 border-b bg-white/90 backdrop-blur-md shadow-sm'
      }
    >
      <div className="flex-1 flex items-center">
        <span className="font-extrabold text-3xl tracking-tight text-blue-700 drop-shadow-sm select-none">
          Notrello
        </span>
      </div>
      {!isApp && (
        <nav className="hidden md:flex gap-8 text-base font-medium">
          <a href="#features" className="hover:text-blue-600 transition">
            Fonctionnalités
          </a>
          <a href="#pourquoi" className="hover:text-blue-600 transition">
            Pourquoi
          </a>
          <a href="#about" className="hover:text-blue-600 transition">
            À propos
          </a>
          <a href="#contact" className="hover:text-blue-600 transition">
            Contact
          </a>
        </nav>
      )}
      <div className={`flex items-center gap-4${!isApp ? ' ml-8' : ''}`}>
        {user ? (
          <div className="relative z-50" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <span className="font-medium">{user.pseudo}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[100]">
                <a
                  href="/dashboard"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Dashboard
                </a>
                <a
                  href="/dashboard/calendar"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Calendrier
                </a>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Se connecter
          </button>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  )
}
