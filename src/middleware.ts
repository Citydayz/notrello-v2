import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export async function middleware(request: NextRequest) {
  // Vérifier si la route est protégée
  if (!request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('payload-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      throw new Error('Missing PAYLOAD_SECRET')
    }

    verify(token, secret)
    return NextResponse.next()
  } catch {
    // En cas d'erreur de token, rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
