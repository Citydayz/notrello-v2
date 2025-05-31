import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserFromToken } from '@/utils/auth'
import ClientLayout from './ClientLayout'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  const user = getUserFromToken(token)
  if (!user) {
    redirect('/login')
  }

  return <ClientLayout>{children}</ClientLayout>
}
