import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Studio — Turn any link into a QR code',
  description: 'Instantly generate high-quality QR codes from any URL. Download as PNG or SVG. Free, fast, no tracking.',
  openGraph: {
    title: 'QR Studio',
    description: 'Turn any link into a QR code instantly.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
