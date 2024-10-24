import Image from 'next/image';
import React from 'react';
import OwlLogo from './owl-logo';

const AppLogo = ({
  width = 64,
  height = 64,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <h2 className='row flex w-full items-center justify-center gap-4 p-4 lg:justify-start'>
      <OwlLogo/>
      <div className='hidden text-2xl text-text-foreground font-black lg:block'>
        Chat <span className='text-2xl font-medium'>AI</span>
      </div>
    </h2>
  );
};

export default AppLogo;
