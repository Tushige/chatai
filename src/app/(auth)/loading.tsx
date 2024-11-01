import Loader from '@/components/loader';
import React from 'react';

const Loading = () => {
  return (
    <div className='h-[90vh] w-full flex items-center justify-center'>
      <Loader />
    </div>
  );
};

export default Loading;
