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
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Close } from '@radix-ui/react-dialog';
import { Separator } from '../ui/separator';
import { User } from '@prisma/client';

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
  user: User;
};

const AppNavbar = ({ user }: Props) => {
  const pathname = usePathname();
  return (
    <>
      <div className="sticky top-0 left-0">
        <div className="hidden w-full h-full md:block">
          <DesktopNav user={user} pathname={pathname}/>
        </div>
      </div>
      <div className="md:hidden">
        <MobileNav user={user} pathname={pathname}/>
      </div>
    </>
  )
}
type NavProps = {
  user: User,
  pathname: string
}
function DesktopNav({ user, pathname }: NavProps) {
  return (
    <div className='h-full min-w-[100px] bg-background-secondary lg:min-w-[300px]'>
      <div className="px-4">
        <AppLogo variant="navbar"/>
      </div>
      <Menu pathname={pathname} />
      <Separator className="border-border w-[90%] mx-auto"/>
      <DomainMenu user={user} pathname={pathname} />
      <MenuOptions />
    </div>
  );
};

const MobileNav = ({ user, pathname}: NavProps) => {
  return (
    <section className="w-full bg-background-secondary h-[100px] flex flex-grow justify-between items-center px-4">
      <AppLogo className="justify-start"/>
      <MobileNavSheet user={user} pathname={pathname}/>
    </section>
  )
}


function MobileNavSheet({ user, pathname}: NavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild className="bg-background text-text">
        <Button variant="outline">MENU</Button>
      </SheetTrigger>
      <SheetContent>
        <div className="h-full flex flex-col gap-2 items-start">
          <Menu pathname={pathname} mobile={true}/>
          <Separator className="border-border w-[90%] mx-auto"/>
          <DomainMenu user={user} pathname={pathname} mobile={true}/>
          <MenuOptions />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Menu({ pathname, mobile }: { pathname: string, mobile?: boolean }) {
  return (
    <ul className="w-full">
      {links.map((link) => (
        <MenuItem key={link.href} link={link} pathname={pathname} mobile={mobile} />
      ))}
    </ul>
  );
}

function MenuItem({ link, pathname, mobile }:
  { link: LinkProp; pathname: string, mobile?: boolean }
) {
  const Icon = link.icon;
  const LinkContainer = mobile ? Close : 'div';
  return (
    <li
      key={link.href}
      className={cn('hover:bg-surface w-full p-4', {
        'bg-surface': pathname.includes(link.href),
      })}
    >
      <Link
        href={link.href}
        className={cn(
          'h-[48px] w-full'
        )}
      >
        <LinkContainer className="flex grow items-center gap-2 rounded-md text-sm font-medium text-text hover:text-text-foreground justify-start md:justify-center lg:justify-start">
          <Icon className='w-6' />
          <span className='block md:hidden lg:block text-base'>{link.label}</span>
        </LinkContainer>
      </Link>
    </li>
  );
}

function MenuOptions() {
  return (
    <div className='absolute left-0 bottom-0 w-full bg-background md:bg-background-secondary p-4'>
      {/* <Button className='flex-start flex w-full flex-row gap-2 rounded-md bg-background md:bg-background-secondary hover:bg-surface'> */}
        <Link
          href='/sign-out'
          className='w-full flex flex-row flex-start gap-2 rounded-md p-4 px-6 bg-background-secondary md:bg-background-secondary hover:bg-surface text-medium text-text'
        >
          <ArrowLeftEndOnRectangleIcon className='w-6 text-text' />
          <span className="inline-block md:hidden lg:inline-block">Sign Out</span>
        </Link>
      {/* </Button> */}
    </div>
  );
}
export default AppNavbar;
