'use client';

import { cn } from '@/lib/utils';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';

export const WithGlow = ({ children, className }) => {
  const duration = 5000;
  const pathRef = useRef(null);
  const progress = useMotionValue<number>(0);
  const border = useRef<HTMLDivElement>(null);

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );
  const maskImage = useMotionTemplate`radial-gradient(100px 120px at ${x}px ${y}px, black, transparent)`;

  useAnimationFrame((time) => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });
  return (
    <div className={cn('relative', className)}>
      <div className='absolute inset-0 rounded-xl'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='none'
          className='absolute h-full w-full'
          width='100%'
          height='100%'
        >
          <rect
            fill='none'
            width='100%'
            height='100%'
            rx='30%'
            ry='30%'
            ref={pathRef}
          />
        </svg>
      </div>
      <motion.div
        ref={border}
        className={cn('absolute inset-0 rounded-xl border-4', 'border-accent')}
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      />
      {children}
    </div>
  );
};
