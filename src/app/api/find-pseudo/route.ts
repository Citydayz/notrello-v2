import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pseudo = searchParams.get('pseudo')
  if (!pseudo) {
    return NextResponse.json({ exists: false })
  }
  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
    where: { pseudo: { equals: pseudo } },
    limit: 1,
  })
  return NextResponse.json({ exists: users.docs.length > 0 })
}
