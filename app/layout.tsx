import { ClerkProvider } from '@clerk/nextjs' // import the ClerkProvider, SignedIn, SignedOut, SignInButton, and UserButton components from the Clerk SDK
import React from 'react'
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from 'next/font/google' // import the Inter and Space_Grotesk fonts from the Google Fonts API
import type { Metadata } from 'next' // import the Metadata type from the next package

import './globals.css' // import the global styles from the globals.css file
import { ThemeProvider } from '@/context/ThemeProvider'

// create a new Inter font with the specified options
const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

// create a new Space Grotesk font with the specified options
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
})

// create a new Metadata object with the specified options
export const metadata: Metadata = {
  title: 'DevFlow',
  description: ' A platform for developers to share their knowledge',
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
}

// by wrapping the children in the ClerkProvider component, we can access the user session in any child component and style every page with the ThemeProvider component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: 'primary-gradient',
              footerActionLink: 'primary-text-gradient hover:text-primary-500',
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
