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

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ cartes: [] }, { status: 401 })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'cartes',
    where: { user: { equals: userId } },
    limit: 100,
  })
  return NextResponse.json({ cartes: docs })
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { titre, type, description, heure, heureFin } = await req.json()
  if (!titre || !heure) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const carte = await payload.create({
    collection: 'cartes',
    data: {
      titre,
      type: type || null,
      description,
      heure,
      heureFin,
      date: new Date().toISOString().slice(0, 10), // date du jour
      user: userId,
    },
  })
  return NextResponse.json({ carte })
}
