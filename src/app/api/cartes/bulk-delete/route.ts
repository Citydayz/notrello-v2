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

async function handleDelete(req: NextRequest) {
  const userId = await getUserIdFromRequest()
  if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { ids } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'Aucune carte à supprimer' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  // Vérifier que toutes les cartes appartiennent à l'utilisateur
  const cartes = await payload.find({
    collection: 'cartes',
    where: {
      and: [{ id: { in: ids } }, { user: { equals: userId } }],
    },
    req,
  })

  if (cartes.docs.length !== ids.length) {
    return NextResponse.json(
      { error: "Certaines cartes n'existent pas ou ne vous appartiennent pas" },
      { status: 403 },
    )
  }

  // Supprimer toutes les cartes en une seule opération
  const result = await payload.delete({
    collection: 'cartes',
    where: {
      id: { in: ids },
    },
    depth: 0,
    overrideAccess: false,
    user: { id: userId },
    req,
  })

  return NextResponse.json({ success: true, deleted: result.docs })
}

export async function POST(req: NextRequest) {
  return handleDelete(req)
}

export async function DELETE(req: NextRequest) {
  return handleDelete(req)
}
