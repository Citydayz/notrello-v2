import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import { getUserFromToken } from '@/utils/auth'

async function getUserIdFromRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  const decoded = getUserFromToken(token)
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
  console.log('[API custom-cat] POST appelée')
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    // On récupère d'abord le corps brut de la requête
    const rawBody = await req.text()
    console.log('[API custom-cat] Corps brut de la requête:', rawBody)

    // On extrait le JSON du multipart/form-data
    const jsonMatch = rawBody.match(/\{.*\}/s)
    if (!jsonMatch) {
      console.error('[API custom-cat] Pas de JSON trouvé dans la requête')
      return NextResponse.json({ error: 'Format de données invalide' }, { status: 400 })
    }

    // On parse le JSON extrait
    let body
    try {
      body = JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('[API custom-cat] Erreur de parsing JSON:', e)
      return NextResponse.json({ error: 'Format de données invalide' }, { status: 400 })
    }

    console.log('[API custom-cat] Corps de la requête parsé:', body)

    if (!body.nom) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const categorie = await payload.create({
      collection: 'custom-cat' as any,
      data: {
        nom: body.nom,
        couleur: body.couleur || 'blue',
        user: userId,
      } as any,
    })

    return NextResponse.json({ categorie })
  } catch (error) {
    console.error('[API custom-cat] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 },
    )
  }
}
