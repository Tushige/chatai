import React from 'react';
import Loader from '@/components/loader';

const Loading = () => {
  return (
    <div className='h-[100vh] w-full items-center justify-center bg-background'>
      <Loader/>
    </div>
  );
};

export default Loading;
