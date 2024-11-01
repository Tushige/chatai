'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};
const Loader = ({ className }: Props) => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <motion.div
        className={cn('size-[50px] bg-accent', className)}
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ['20%', '20%', '50%', '50%', '20%'],
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
    </div>
  );
};

export default Loader;
