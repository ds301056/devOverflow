import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  // SignInButton,
  UserButton,
} from '@clerk/nextjs'
import React from 'react'

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
    <ClerkProvider>
      <html lang="en">
        <head>{/* Add any meta tags or links here */}</head>
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
