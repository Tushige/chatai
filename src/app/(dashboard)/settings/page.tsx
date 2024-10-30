import AppSectionContainer from '@/components/app-section-container';
import AppSectionHeroContainer from '@/components/app-section-hero-container';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const links = [
  {
    href: '/settings/membership',
    label: 'Manage membership',
  },
  {
    href: '/settings/themes',
    label: 'Themes',
  },
  {
    href: '/settings/password',
    label: 'Change Password',
  },
];
const SettingsPage = () => {
  return (
    <div className='w-full'>
      <AppSectionHeroContainer>
        <h1 className='text-4xl font-bold'>Settings</h1>
      </AppSectionHeroContainer>
      <AppSectionContainer>
        <h2 className='text-secondary mb-4 mt-4 font-medium'>Quick Links</h2>
        <div className='max-w-[50rem] rounded-md border-border bg-surface p-2'>
          <ul className='flex flex-col'>
            {links.map((link, idx) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className='flex h-full w-full flex-row justify-between rounded-md px-2 py-4 hover:bg-hover'
                >
                  <span>{link.label}</span>
                  <ArrowRight className='text-secondary size-6 opacity-50' />
                </Link>
                {idx < links.length - 1 && (
                  <Separator className='border-border' />
                )}
              </div>
            ))}
          </ul>
        </div>
      </AppSectionContainer>
    </div>
  );
};

export default SettingsPage;
