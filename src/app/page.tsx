'use client';
import AppHeader from '@/ui/home/app-header';
import { FeaturesSection } from '@/ui/home/features-section';
import HeroSection from '@/ui/home/hero-section';
import Link from 'next/link';
import {AppCtaButton} from '@/components/app-cta-button';
import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { AuthContext } from '@/context/use-auth-context';

export default function Home() {
  const {authId} = useContext(AuthContext)
  return (
    <div className='text-text grid items-center justify-items-center gap-16 font-[family-name:var(--font-dm-sans)] overflow-x-hidden px-8 pb-8 lg:px-4'>
      <AppHeader />
      <main className="container flex flex-col items-start sm:items-center">
        <HeroSection/>
        <SectionSeparator />
        <FeaturesSection />
        <SectionSeparator />
      </main>
      <footer className="container">
        <div className='flex justify-between items-center'>
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
        </div>
      </footer>
    </div>
  );
}

function SectionSeparator({className = ''}) {
  return (
    <div className={cn("mt-24", className)}/>
  )
}