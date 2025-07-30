import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'THE HAYEK PARTY',
  description: 'Convite interativo para o aniversário de Jhon Hayek - 02/07 às 16h',
  keywords: ['festa', 'aniversário', 'jhon hayek', 'cyberpunk', 'hacker'],
  authors: [{ name: 'Hayek Party Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8B5CF6',
  openGraph: {
    title: 'THE HAYEK PARTY',
    description: 'Você foi convocado para uma missão especial - 02/07 às 16h',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE HAYEK PARTY',
    description: 'Você foi convocado para uma missão especial - 02/07 às 16h',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="font-mono bg-cyber-dark text-white min-h-screen">
        <div className="fixed inset-0 bg-cyber-grid bg-grid opacity-20 pointer-events-none" />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
} 