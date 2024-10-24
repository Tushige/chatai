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
      <div className='max-w-4000px relative hidden max-h-full w-full flex-1 flex-col gap-3 overflow-hidden bg-surface pl-24 pt-10 lg:flex'>
        <h2 className='font-bold text-text md:text-4xl'>Hi! I'm Chat AI</h2>
        <p className='mb-10 text-text-secondary md:text-sm'>
          I am here to help your businesses turn conversations into leads.
        </p>
        <div className="glass-container mt-8 absolute top-0 max-w-[1600px] min-w-[800px] shrink-0 p-4">
          <div className="absolute inset-0 z-[-1] bg-[#711000] blur-2xl filter"/>
          <Image
            src="/images/desktop-1.png"
            // src="/images/appwrite-dashboard.png"
            unoptimized
            width={0}
            height={0}
            alt='product screenshot'
            sizes='30'
            className="w-[100%] z-1 p-4"
            style={{
              borderRadius: '25px'
            }}
          />
        </div>
      </div>
      <div className='flex w-[600px] flex-col items-start p-6'>{children}</div>
    </div>
  );
};

export default layout;
