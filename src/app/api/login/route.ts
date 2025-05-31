import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { serialize } from 'cookie'
import { loginSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  const { identifier, password } = loginSchema.parse(await req.json())
  const payload = await getPayload({ config })

  let email = identifier

  if (!identifier.includes('@')) {
    const users = await payload.find({
      collection: 'users',
      where: { pseudo: { equals: identifier } },
      limit: 1,
    })

    if (!users.docs.length) {
      return NextResponse.json({ error: 'Pseudo inconnu' }, { status: 401 })
    }

    email = users.docs[0].email
  }

  try {
    const { token } = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!token) {
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }

    const res = NextResponse.json({ success: true })

    res.headers.set(
      'Set-Cookie',
      serialize('payload-token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      }),
    )

    return res
  } catch (err) {
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 })
  }
}
