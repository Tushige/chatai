import AppHeader from '@/ui/home/app-header';
import HeroSection from '@/ui/home/hero-section';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='bg-background text-text grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-dm-sans)] sm:p-20'>
      <AppHeader />
      <main className="container row-start-2 flex flex-col items-start sm:items-center">
        <HeroSection/>
        
      </main>
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='https://nextjs.org/icons/file.svg'
            alt='File icon'
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='https://nextjs.org/icons/window.svg'
            alt='Window icon'
            width={16}
            height={16}
          />
          Examples
        </a>
      </footer>
    </div>
  );
}
