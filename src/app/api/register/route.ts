import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { serialize } from 'cookie'
import { registerSchema } from '@/lib/schemas'

export async function POST(req: NextRequest) {
  const { pseudo, email, password } = registerSchema.parse(await req.json())
  const payload = await getPayload({ config })

  try {
    // Vérifier si le pseudo existe déjà
    const existingPseudo = await payload.find({
      collection: 'users',
      where: { pseudo: { equals: pseudo } },
      limit: 1,
    })

    if (existingPseudo.docs.length > 0) {
      return NextResponse.json({ error: 'Ce pseudo est déjà utilisé' }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existingEmail.docs.length > 0) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 })
    }

    // Créer l'utilisateur
    await payload.create({
      collection: 'users',
      data: {
        pseudo,
        email,
        password,
      },
    })

    // Connecter l'utilisateur pour obtenir le token
    const { token } = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
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
    return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 })
  }
}
