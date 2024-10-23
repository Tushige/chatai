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
    // <Image
    //   src='/images/owl-logo.svg'
    //   width={width}
    //   height={height}
    //   alt='App logo'
    //   className="bg-accent"
    // />
    <OwlLogo/>
  );
};

export default AppLogo;
