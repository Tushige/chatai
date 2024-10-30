import React from 'react';
import AppPublicNavbar from '@/components/app-public-navbar';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-screen w-full flex-col overflow-hidden bg-background'>
      <div className=''>
        <AppPublicNavbar />
      </div>
      <div className='flex w-full flex-col bg-background text-text'>
        <div className='container mx-auto flex px-4 pt-8 lg:px-8'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
