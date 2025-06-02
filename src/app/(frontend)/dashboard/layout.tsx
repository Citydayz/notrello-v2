import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from '@/lib/auth'
import ClientLayout from './ClientLayout'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  let user = null
  if (token) {
    try {
      const decoded = getUserFromToken(token)
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
