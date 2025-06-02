'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import jwt, { verify, JwtPayload } from 'jsonwebtoken'
import type { User } from '@/payload-types'

export type UserToken = JwtPayload & {
  id: string
  email: string
}

export async function getMe(): Promise<{ user: User | null }> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return { user: null }
  }

  try {
    const decoded = jwt.decode(token)
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      return { user: null }
    }
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: { id: { equals: decoded.id } },
      limit: 1,
    })
    if (!docs.length) {
      return { user: null }
    }
    return { user: docs[0] as User }
  } catch (_error) {
    return { user: null }
  }
}

export async function verifyUserToken(token: string): Promise<UserToken> {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) {
    throw new Error('Missing PAYLOAD_SECRET')
  }

  const decoded = verify(token, secret)
  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    !('id' in decoded) ||
    !('email' in decoded)
  ) {
    throw new Error('Invalid token payload')
  }

  return decoded as UserToken
}
