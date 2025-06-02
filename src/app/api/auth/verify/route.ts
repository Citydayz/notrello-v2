import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import type { UserToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('payload-token=')[1]?.split(';')[0]

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

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

    return NextResponse.json({ user: decoded as UserToken })
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
