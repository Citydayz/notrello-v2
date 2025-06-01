import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import ClientLayout from './ClientLayout'
// import { SpeedInsights } from '@vercel/speed-insights/next'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  let user = null
  if (token) {
    try {
      const decoded = jwt.decode(token)
      if (decoded && typeof decoded === 'object' && decoded.email) {
        user = decoded
      }
    } catch {
      user = null
    }
  }
  if (!user) {
    redirect('/login')
  }

  return <ClientLayout>{children}</ClientLayout>
}
