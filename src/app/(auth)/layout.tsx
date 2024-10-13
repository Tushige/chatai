import { AuthContext } from '@/context/use-auth-context';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useContext } from 'react';

const layout = async ({ children }: { children: React.ReactNode }) => {
  // TODO - uncomment this to prevent authenticated users from accessing the auth flow
  // const {authId} = useContext(AuthContext)
  // if (authId) redirect('/')
  return (
    <div className='flex h-screen w-full justify-center bg-background'>
      <div className='flex w-[600px] flex-col items-start p-6'>{children}</div>
      <div className='max-w-4000px relative hidden max-h-full w-full flex-1 flex-col gap-3 overflow-hidden bg-surface pl-24 pt-10 lg:flex'>
        <h2 className='font-bold text-text md:text-4xl'>Hi! I'm Fincent</h2>
        <p className='mb-10 text-text-secondary md:text-sm'>
          I am here to answer any questions that you may have
        </p>
        <Image
          src='/images/appwrite-dashboard.png'
          unoptimized
          width={0}
          height={0}
          alt='product screenshot'
          sizes='30'
          className='absolute top-48 !w-[1600px] shrink-0'
        />
      </div>
    </div>
  );
};

export default layout;
