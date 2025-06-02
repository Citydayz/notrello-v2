'use client'

import { useEffect, useState } from 'react'
import { UserToken, verifyToken } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<UserToken | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = document.cookie.split('payload-token=')[1]?.split(';')[0]
        if (token) {
          const user = await verifyToken(token)
          setUser(user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, loading }
}
