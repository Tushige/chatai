
import React from 'react';
import MessageLogo from './message-logo';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const appLogoVariants = cva(
  'text-2xl text-text-foreground font-black lg:block',
  {
    variants: {
      variant: {
        default: '',
        navbar: 'hidden'
      }
    }
  }
)

export interface AppLogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appLogoVariants> {}

const AppLogo = ({
  variant,
  className = ''
}: AppLogoProps) => {
  return (
    <Link href="/" className={cn('row flex w-full items-center justify-center gap-4 py-4 lg:justify-start', className)}>
      <MessageLogo/>
      <div className={cn(appLogoVariants({ variant }))}>
        Chat <span className='text-2xl font-medium'>AI</span>
      </div>
    </Link>
  );
};

export default AppLogo;
