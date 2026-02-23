import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import localFont from 'next/font/local'

export const displayFont = Frank_Ruhl_Libre({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-display-var',
  display: 'swap',
})

export const bodyFont = Heebo({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500'],
  variable: '--font-body-var',
  display: 'swap',
})

export const handwritingFont = localFont({
  src: [
    {
      path: '../public/fonts/DanaYadAlefAlefAlef-Normal.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-handwriting-var',
  display: 'swap',
})
