'use client';
import { deleteDomain } from '@/actions/domain.action';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  id: string;
  className?: string;
};
const DomainDeleteBox = ({ id, className }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const onDelete = async () => {
    try {
      const res = await deleteDomain(id);
      toast({
        title: res.status === 200 ? 'Success' : 'Error',
        description: res.message,
      });
      if (res.status === 200) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again',
      });
    }
  };
  return (
    <div className={cn('mt-8 rounded-md border border-red-600 p-2', className)}>
      <h2 className='mb-8 text-red-600'>Danger Zone</h2>
      <Button
        className='bg-red-300 text-red-700 hover:bg-red-900 hover:text-white'
        onClick={onDelete}
      >
        Delete Domain
      </Button>
    </div>
  );
};

export default DomainDeleteBox;
