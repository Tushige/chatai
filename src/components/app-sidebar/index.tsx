'use client';
import React from 'react';
import AppLogo from '../app-logo';
import {
  ArrowLeftEndOnRectangleIcon,
  BoltIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { DomainMenu } from './domain/domain-menu';
import { Domain } from '@prisma/client';

type LinkProp = {
  label: string;
  href: string;
  icon: React.ComponentType;
};

const links: LinkProp[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: SquaresPlusIcon,
  },
  {
    label: 'Conversations',
    href: '/conversations',
    icon: ChatBubbleOvalLeftIcon,
  },
  {
    label: 'Integrations',
    href: '/integrations',
    icon: BoltIcon,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
  },
  {
    label: 'Appointments',
    href: '/appointments',
    icon: PencilSquareIcon,
  },
  {
    label: 'Campaigns',
    href: '/campaigns',
    icon: ChartBarIcon,
  },
];

type Props = {
  user: any;
};
const AppSideBar = ({ user }: Props) => {
  const pathname = usePathname();
  return (
    <div className='h-full min-w-[100px] bg-background-secondary lg:min-w-[300px]'>
      <h2 className='row flex w-full items-center justify-center gap-4 p-4 lg:justify-start'>
        <AppLogo />
        <div className='hidden text-2xl font-black text-text-foreground lg:block'>
          AI <span className='font-medium'>Campaigner</span>
        </div>
      </h2>
      <Menu pathname={pathname} />
      <DomainMenu user={user} pathname={pathname} />
      <MenuOptions />
    </div>
  );
};

function Menu({ pathname }: { pathname: string }) {
  return (
    <ul>
      {links.map((link) => (
        <MenuItem key={link.href} link={link} pathname={pathname} />
      ))}
    </ul>
  );
}
function MenuItem({ link, pathname }: { link: LinkProp; pathname: string }) {
  const Icon = link.icon;
  return (
    <li
      key={link.href}
      className={cn('px-4 hover:bg-surface', {
        'bg-surface': pathname === link.href,
      })}
    >
      <Link
        href={link.href}
        className={cn(
          'flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-text hover:text-text-foreground lg:justify-start'
        )}
      >
        <Icon className='w-6' />
        <span className='hidden lg:block'>{link.label}</span>
      </Link>
    </li>
  );
}
function MenuOptions() {
  return (
    <div className='absolute bottom-0 w-full bg-background-secondary p-4'>
      <Button className='flex-start flex w-full flex-row gap-2 rounded-md bg-background hover:bg-surface'>
        <ArrowLeftEndOnRectangleIcon className='w-6 text-text' />
        <Link
          href='/sign-out'
          className='text-medium hidden text-text lg:inline-block'
        >
          Sign Out
        </Link>
      </Button>
    </div>
  );
}
export default AppSideBar;
