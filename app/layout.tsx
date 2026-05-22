import type { Metadata, Viewport } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ui/ThemeProvider'
import QueryProvider from '@/components/ui/QueryProvider'

export const metadata: Metadata = {
  title: 'Salary Calc',
  description: 'Personal shift tracker and salary calculator',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}