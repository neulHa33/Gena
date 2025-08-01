import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DarkModeToggle from '../components/DarkModeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GenaSQL',
  description: 'Interactive dashboard with real-time analytics',
  icons: {
    icon: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-black text-gray-900 dark:text-white transition-colors`}>
        <DarkModeToggle />
        {children}
      </body>
    </html>
  )
}
