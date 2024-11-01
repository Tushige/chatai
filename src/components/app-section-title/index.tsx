import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  title: string;
  description?: string;
  className?: string;
};
const AppSectionTitle = ({ title, description, className }: Props) => {
  return (
    <div className={cn(className)}>
      <h2 className='text-lg md:text-2xl font-medium text-text-foreground'>{title}</h2>
      <p className='text-text-secondary mt-2 max-w-[42rem] text-sm lg:mt-4'>
        {description}
      </p>
    </div>
  );
};

export default AppSectionTitle;
