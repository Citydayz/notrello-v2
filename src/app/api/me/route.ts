import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const decoded = jwt.decode(token)
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: {
        id: { equals: decoded.id },
      },
      limit: 1,
    })

    if (!docs.length) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user: docs[0] })
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
