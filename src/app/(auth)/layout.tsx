import AppLogo from '@/components/app-logo';
import { AuthContext } from '@/context/use-auth-context';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useContext } from 'react';
import {BackgroundWavy} from '@/components/ui/background-wavy';
import {AuroraBackground} from '@/components/ui/background-aurora';

const layout = async ({ children }: { children: React.ReactNode }) => {
  // TODO - uncomment this to prevent authenticated users from accessing the auth flow
  // const {authId} = useContext(AuthContext)
  // if (authId) redirect('/')
  return (
    <div className='flex h-screen w-full justify-center bg-background'>
      <div className='max-w-4000px relative hidden w-full flex-1 flex-col gap-3 overflow-hidden bg-surface pl-24 pt-10 lg:flex'>
        <h2 className='font-bold text-text md:text-4xl z-[1]'>
          <AppLogo/>
        </h2>
        <BackgroundWavy className=" mx-auto pb-40" />
      </div>
      <div className="flex flex-col p-4">
        
        <div className="lg:hidden">
          <h2 className='font-bold text-text md:text-4xl z-[1]'>
            <AppLogo className="justify-start"/>
          </h2>
        </div>

        <div className='flex w-full lg:w-[600px] flex-col items-start p-4'>
          {children}
        </div>

      </div>
    </div>
  );
};

export default layout;
