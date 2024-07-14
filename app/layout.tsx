import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  // SignInButton,
  UserButton,
} from '@clerk/nextjs'
import React from 'react'
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
})

export const metadata: Metadata = {
  title: 'DevFlow',
  description: ' A platform for developers to share their knowledge',
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
}

function Header() {
  return (
    <header
      style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}
    >
      <SignedIn>
        {/* Mount the UserButton component */}
        {/* <UserButton /> */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Mount the SignInButton component */}
        {/* <SignInButton /> */}
      </SignedOut>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'primary-gradient',
          footerActionLink: 'primary-text-gradient hover:text-primary-500',
        },
      }}
    >
      <html lang="en">
        <h1 className="h1-bold">This is a piece of text.</h1>

        {/* by wrapping the children in the ClerkProvider component, we can access the user session in any child component and style every page  */}
        <body className={'${inter.variable ${spaceGrotesk.variable}'}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
