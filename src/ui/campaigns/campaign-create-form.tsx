'use client';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Loader, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import CampaignAddForm from './campaign-add-form';

export default function CampaignCreateForm({ domainId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className='py-12'>
        <Loader className='h-[30px] w-[30px]' />
      </div>
    );
  }
  return (
    <Drawer open={open}>
      <div className='flex items-center justify-center'>
        <Button
          className='rounded-full bg-background p-2 text-text hover:bg-surface hover:text-text-foreground'
          onClick={() => setOpen(true)}
        >
          <PlusIcon className='w-6' />
        </Button>
      </div>
      <DrawerContent className='pb-12'>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            <DrawerTitle className='text-text-foreground'>
              Create a Campaign
            </DrawerTitle>
            <CampaignAddForm
              closeDrawer={() => setOpen(false)}
              onSuccess={() => setOpen(false)}
              loading={loading}
              setLoading={setLoading}
              domainId={domainId}
            />
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
