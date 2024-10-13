import { getAuthId } from '@/actions/auth';
import { getAuthUser } from '@/actions/user.action';
import AppSideBar from '@/components/app-sidebar';
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
    <div className='flex h-screen w-full overflow-hidden'>
      <div className='sticky left-0 top-0'>
        <AppSideBar user={authUser} />
      </div>
      <Separator orientation='vertical' />
      <div className='flex h-screen w-full flex-col overflow-y-scroll bg-background text-text'>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
