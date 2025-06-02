import { headers } from 'next/headers'
import { getMe } from '@/lib/server-auth'
import Header from './components/layouts/Header'

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getMe()
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isApp = pathname.startsWith('/dashboard')

  return (
    <div className={`min-h-screen ${isApp ? 'bg-gray-100' : 'bg-white'}`}>
      <Header initialUser={user} isApp={isApp} />
      {children}
    </div>
  )
}
