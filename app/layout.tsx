import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { PreferencesProvider } from '@/components/providers/PreferencesProvider'

export const metadata: Metadata = {
  title: 'StreamParadise - Watch Movies & TV Shows Online',
  description: 'Premium streaming platform with instant playback and multiple servers'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PreferencesProvider>
          <Navbar />
          <main className="pt-16 pb-8">{children}</main>
        </PreferencesProvider>
      </body>
    </html>
  )
}