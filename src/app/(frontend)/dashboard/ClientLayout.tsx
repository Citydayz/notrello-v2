'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { UserToken } from '@/lib/server-auth'

export default function ClientLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: UserToken
}) {
  const pathname = usePathname()
  const [isNavVisible, setIsNavVisible] = useState(true)

  const navItems = [
    { href: '/dashboard', icon: <HomeIcon className="w-6 h-6" />, label: 'Timeline' },
    {
      href: '/dashboard/calendar',
      icon: <CalendarIcon className="w-6 h-6" />,
      label: 'Calendrier',
    },
    { href: '/dashboard/history', icon: <ClockIcon className="w-6 h-6" />, label: 'Historique' },
    { href: '/dashboard/notes', icon: <DocumentTextIcon className="w-6 h-6" />, label: 'Notes' },
    { href: '/dashboard/profile', icon: <UserIcon className="w-6 h-6" />, label: 'Mon compte' },
  ]

  // Force le recalcul du calendrier après le toggle
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 350) // attendre la fin de l'animation
  }, [isNavVisible])

  return (
    <div className="flex h-screen relative">
      <motion.aside
        animate={{ width: isNavVisible ? 256 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white border-r overflow-hidden h-full"
        style={{ minWidth: 0 }}
      >
        {isNavVisible && (
          <div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-blue-700">Navigation</h2>
            </div>
            <nav className="mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition ${
                    pathname === item.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </motion.aside>
      <button
        onClick={() => setIsNavVisible(!isNavVisible)}
        className="fixed z-20 left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white border border-blue-700 rounded-r-lg p-2 shadow-lg hover:bg-blue-700 transition"
        aria-label={isNavVisible ? 'Masquer la navigation' : 'Afficher la navigation'}
        style={{ transition: 'background 0.2s, color 0.2s' }}
      >
        {isNavVisible ? (
          <ChevronLeftIcon className="w-5 h-5" />
        ) : (
          <ChevronRightIcon className="w-5 h-5" />
        )}
      </button>
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
