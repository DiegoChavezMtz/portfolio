import type { Metadata } from 'next'
import { Space_Mono, Syne } from 'next/font/google'
import StyledComponentsRegistry from '@/lib/registry'
import { GlobalStyles } from '@/styles/GlobalStyles'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Diego Chávez — Portfolio',
  description: 'Full-Stack Engineer & DevOps based in Mexico City.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
