import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  if (!email) {
    return NextResponse.json({ exists: false })
  }
  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  return NextResponse.json({ exists: users.docs.length > 0 })
}
