import type { Metadata } from 'next'
import { displayFont, bodyFont, handwritingFont } from '@/lib/fonts'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'הוזמנתם',
  description: 'אנא אשרו הגעה לחתונתנו',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${displayFont.variable} ${bodyFont.variable} ${handwritingFont.variable}`}>
      <body>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
