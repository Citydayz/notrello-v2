import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './(frontend)/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notrello - Organisez vos notes efficacement',
  description: 'Une application de prise de notes moderne et intuitive',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
