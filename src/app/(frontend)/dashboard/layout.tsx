import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyUserToken } from '@/lib/server-auth'
import ClientLayout from './ClientLayout'
// import { SpeedInsights } from '@vercel/speed-insights/next'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    const user = await verifyUserToken(token)
    return <ClientLayout user={user}>{children}</ClientLayout>
  } catch {
    redirect('/login')
  }
}
