import jwt from 'jsonwebtoken'

export interface DecodedUser {
  id?: string
  email?: string
  [key: string]: any
}

export function getUserFromToken(token?: string | null): DecodedUser | null {
  if (!token) return null
  try {
    const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET as string)
    if (typeof decoded === 'object') {
      return decoded as DecodedUser
    }
  } catch (err) {
    console.error('[auth] Invalid token', err)
  }
  return null
}
