'use client'

import { JwtPayload } from 'jsonwebtoken'

export interface UserToken extends JwtPayload {
  id: string
  email: string
}

export async function verifyToken(token: string): Promise<UserToken> {
  const response = await fetch('/api/auth/verify', {
    headers: {
      Cookie: `payload-token=${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Invalid token')
  }

  const data = await response.json()
  return data.user
}
