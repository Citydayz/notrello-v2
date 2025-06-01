import Header from './components/layouts/Header'
import { getMe } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getMe()
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isApp = pathname.startsWith('/dashboard')

  return (
    <>
      <Header initialUser={user} isApp={isApp} />
      {children}
    </>
  )
}
