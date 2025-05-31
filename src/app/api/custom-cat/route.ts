import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { customCatSchema } from '@/lib/schemas'

async function getUserIdFromRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded !== 'object' || !decoded.id) return null
  return decoded.id
}

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ categories: [] }, { status: 401 })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'custom-cat' as any,
    where: { user: { equals: userId } },
    limit: 100,
  })
  return NextResponse.json({ categories: docs })
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const { nom, couleur } = customCatSchema.parse(await req.json())

    const payload = await getPayload({ config })
    const categorie = await payload.create({
      collection: 'custom-cat' as any,
      data: {
        nom,
        couleur: couleur || 'blue',
        user: userId,
      } as any,
    })

    return NextResponse.json({ categorie })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 },
    )
  }
}
