import { getAuthId } from '@/actions/auth';
import { getAuthUser } from '@/actions/user.action';
import AppNavbar from '@/components/app-navbar';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import React from 'react';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const clerkId = await getAuthId();
  if (!clerkId) return;
  const authUser = await getAuthUser(clerkId);
  if (!authUser) {
    redirect('/');
  }
  return (
    <div className='flex flex-col md:flex-row h-screen w-full overflow-hidden'>
      <AppNavbar user={authUser} />
      <Separator className="hidden md:block" orientation='vertical' />
      <div className='flex size-full flex-col hide-scroll overflow-y-scroll bg-background text-text'>
        {children}
      </div>
    </div>
  );
};

export default Layout;
