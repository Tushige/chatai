'use client';
import { getAuthId } from '@/actions/auth';
import { currentUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Page = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  useEffect(() => {
    const doSignOut = async () => {
      const a = await signOut();
      router.push('/')
    };
    doSignOut();
  }, []);
  return <div>Signing out</div>;
};

export default Page;
