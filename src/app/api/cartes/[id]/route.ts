import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

async function getUserIdFromRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded !== 'object' || !decoded.id) return null
  return decoded.id
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { id } = await params
  const payload = await getPayload({ config })
  const carte = await payload.findByID({ collection: 'cartes', id })
  if (!carte) return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })
  if (carte.user !== userId && typeof carte.user === 'object' && carte.user?.id !== userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  // Vérifier le type de contenu
  const contentType = req.headers.get('content-type') || ''
  let body

  if (contentType.includes('application/json')) {
    body = await req.json()
  } else if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    body = Object.fromEntries(formData.entries())
  } else {
    return NextResponse.json({ error: 'Type de contenu non supporté' }, { status: 400 })
  }

  const { titre, description, type, heure, heureFin, date } = body
  const updated = await payload.update({
    collection: 'cartes',
    id,
    data: {
      ...(titre !== undefined && { titre }),
      ...(description !== undefined && { description }),
      ...(type !== undefined && { type }),
      ...(heure !== undefined && { heure }),
      ...(heureFin !== undefined && { heureFin }),
      ...(date !== undefined && { date }),
    },
  })
  return NextResponse.json({ carte: updated })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { id } = await params
  const payload = await getPayload({ config })
  const carte = await payload.findByID({ collection: 'cartes', id })
  if (!carte) return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })
  if (carte.user !== userId && typeof carte.user === 'object' && carte.user?.id !== userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }
  await payload.delete({ collection: 'cartes', id })
  return NextResponse.json({ success: true })
}
