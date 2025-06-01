import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import DashboardClient from './DashboardClient'

async function getUserIdFromRequest() {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  if (!token) return null
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded !== 'object' || !decoded.id) return null
  return decoded.id
}

export default async function DashboardPage() {
  const userId = await getUserIdFromRequest()
  if (!userId) {
    return null
  }

  const payload = await getPayload({ config })

  // Charger les données en parallèle
  const [userData, categoriesData, cartesData] = await Promise.all([
    payload.find({
      collection: 'users',
      where: { id: { equals: userId } },
      limit: 1,
    }),
    payload.find({
      collection: 'custom-cat',
      where: { user: { equals: userId } },
      limit: 100,
    }),
    payload.find({
      collection: 'cartes',
      where: { user: { equals: userId } },
      limit: 100,
    }),
  ])

  const user = userData.docs[0]
  const categories = categoriesData.docs
  const cartes = cartesData.docs

  return (
    <DashboardClient _initialUser={user} initialCategories={categories} initialCartes={cartes} />
  )
}
