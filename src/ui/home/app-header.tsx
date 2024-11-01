'use client';
import { AppCtaButton } from '@/components/app-cta-button'
import AppLogo from '@/components/app-logo'
import { AuthContext } from '@/context/use-auth-context';
import Link from 'next/link'
import React, { useContext } from 'react'

export default function AppHeader() {
  const {authId} = useContext(AuthContext)

  return (
    <header className="container">
      <nav className="flex justify-between items-center">
        <h1>
          <AppLogo/>
        </h1>
        {/* <Button className="focus:ring-offset-3 relative inline-flex h-fit w-fit rounded-full border border-fuchsia-100/20 bg-blue-200/10 px-4 py-2 text-fuchsia-100 outline-none ring-fuchsia-300 transition-colors after:absolute after:inset-0 after:-z-10 after:animate-pulse after:rounded-full after:bg-fuchsia-100 after:bg-opacity-0 after:blur-md after:transition-all after:duration-500 hover:border-fuchsia-200/40 hover:text-fuchsia-300 after:hover:bg-opacity-15 focus:ring-2">
          Get Started
        </Button> */}
        <AppCtaButton>
          {
            authId ? (
              <Link href="/dashboard">
                Dashboard
              </Link>
            ) : (
                <Link href="/sign-up">
                Get Started
              </Link>
            )
          }
        </AppCtaButton>
      </nav>
    </header>
  )
}
