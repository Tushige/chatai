/**
 * Domain
 * - this component is responsible for creating new Domains
 */
'use client';
import DomainAddForm from '@/components/forms/domain/domain-add-form';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Domain } from '@prisma/client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function DomainMenu({ user, pathname }: { user: any; pathname: string }) {
  const pathSegments = pathname.split('/');
  const domainId = pathSegments[pathSegments.length - 1];
  return (
    <>
      <DomainCreateForm
        reachedLimit={user.domains.length >= user.billing.plan.domainLimit}
      />
      <ul>
        {user.domains?.map((domain) => {
          return (
            <li
              key={domain.id}
              className={cn(
                'm-auto w-fit cursor-pointer rounded-full p-4 hover:bg-surface lg:w-full lg:rounded-none',
                { 'bg-surface': domainId === domain.id }
              )}
            >
              <Link
                href={`/domains/${domain.id}`}
                className='flex flex-row justify-center gap-2 lg:justify-start'
              >
                <Image
                  src={`https://ucarecdn.com/${domain.icon}/-/preview/64x64`}
                  width='24'
                  height='24'
                  alt={`logo for the domain ${domain.name}`}
                  unoptimized
                />
                <span className='hidden text-text lg:inline-block'>
                  {domain.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function DomainCreateForm({ reachedLimit }: { reachedLimit: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const closeDrawer = () => setOpen(false);
  const openDrawer = () => setOpen(true);
  return (
    <Drawer open={open}>
      <div className='flex items-center justify-center p-4 lg:justify-between'>
        <span className='hidden text-text lg:inline-block'>Domains</span>
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
            {reachedLimit ? (
              <>
                <DrawerTitle className='text-text-foreground'>
                  You've reached your plan limits
                </DrawerTitle>
                <p className='text-sm text-text'>
                  Upgrade your plan to get access to more resources
                </p>
                <div className='flex items-end justify-between gap-2'>
                  <Button
                    type='button'
                    onClick={closeDrawer}
                    className='border-none bg-transparent text-text shadow-none hover:bg-transparent'
                  >
                    Cancel
                  </Button>
                  <Button
                    className='mt-4 flex w-full flex-row items-end gap-2 rounded-md bg-background text-text hover:bg-surface'
                    onClick={() => {
                      router.push('/settings/membership');
                      closeDrawer();
                    }}
                  >
                    <span>Upgrade</span>
                    <ArrowRight className='size-4 pb-1' />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <DrawerTitle className='text-text-foreground'>
                  Create a Domain
                </DrawerTitle>
                <DrawerDescription className='text-text'>
                  Each chatbot will be associated with a domain
                </DrawerDescription>
                <DomainAddForm
                  closeDrawer={closeDrawer}
                  onSuccess={closeDrawer}
                />
              </>
            )}
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export { DomainMenu };
