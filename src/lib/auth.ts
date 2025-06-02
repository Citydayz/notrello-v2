import { verify, JwtPayload } from 'jsonwebtoken'

export function getUserFromToken(token: string): JwtPayload & { id: string } {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('Missing PAYLOAD_SECRET')

  const decoded = verify(token, secret)
  if (typeof decoded !== 'object' || decoded === null || !('id' in decoded)) {
    throw new Error('Invalid token payload')
  }

  return decoded as JwtPayload & { id: string }
}
