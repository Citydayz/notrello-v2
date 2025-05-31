import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { carteUpdateSchema } from '@/lib/schemas'

async function getUserIdFromRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded !== 'object' || !decoded.id) return null
  return decoded.id
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { id } = await context.params
  const payload = await getPayload({ config })
  const carte = await payload.findByID({ collection: 'cartes', id })
  if (!carte) return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })
  if (carte.user !== userId && carte.user?.id !== userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }
  let body
  try {
    body = await req.json()
  } catch {
    const formData = await req.formData()
    body = Object.fromEntries(formData.entries())
  }
  const { titre, description, type, heure, heureFin, date } =
    carteUpdateSchema.parse(body)
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

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { id } = await context.params
  const payload = await getPayload({ config })
  const carte = await payload.findByID({ collection: 'cartes', id })
  if (!carte) return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })
  if (carte.user !== userId && carte.user?.id !== userId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }
  await payload.delete({ collection: 'cartes', id })
  return NextResponse.json({ success: true })
}
