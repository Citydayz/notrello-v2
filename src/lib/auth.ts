import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import jwt from 'jsonwebtoken'
import type { User } from '@/payload-types'

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
