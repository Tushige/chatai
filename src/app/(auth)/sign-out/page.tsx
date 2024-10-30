'use client';
import Loader from '@/components/loader';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  useEffect(() => {
    const doSignOut = async () => {
      try {
        await signOut();
        router.push('/')
      } catch (err) {
        console.error(err);
      }
    };
    doSignOut();
  }, [router]);
  return (
    <div className='h-[100vh] w-full items-center justify-center'>
      <Loader/>
    </div>
  )
};

export default Page;
