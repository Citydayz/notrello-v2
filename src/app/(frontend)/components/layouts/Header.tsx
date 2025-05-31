'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthModal from '../AuthModal'
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

interface User {
  pseudo: string
}

interface HeaderProps {
  isApp?: boolean
}

export default function Header({ isApp = false }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/me', { credentials: 'include' })
      const data = await res.json()
      setUser(data.user)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }

  return (
    <header className="flex items-center justify-between px-8 py-6 border-b bg-white/90 backdrop-blur-md shadow-sm">
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
      {user ? (
        <div className="flex items-center gap-6 ml-12">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <UserIcon className="w-5 h-5" />
              <span>{user.pseudo}</span>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Mon compte</span>
                </Link>
                <Link
                  href="/dashboard/history"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <ClockIcon className="w-5 h-5" />
                  <span>Historique</span>
                </Link>
                <Link
                  href="/dashboard/notes"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Toutes mes notes</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
            >
              <ClockIcon className="w-5 h-5" />
              <span>Timeline</span>
            </Link>
            <Link
              href="/dashboard/calendar"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Calendrier</span>
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="ml-8 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
        >
          Se connecter
        </button>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </header>
  )
}
