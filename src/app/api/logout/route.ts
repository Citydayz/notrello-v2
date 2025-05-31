import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  const res = NextResponse.json({ success: true })

  res.headers.set(
    'Set-Cookie',
    serialize('payload-token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }),
  )

  return res
}
