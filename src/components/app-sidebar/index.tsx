'use client'
import React from 'react'
import AppLogo from '../app-logo'
import {
  ArrowLeftEndOnRectangleIcon,
  BoltIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { DomainMenu } from './domain/domain-menu'
import { Domain } from '@prisma/client'

type LinkProp = {
  label: string,
  href: string,
  icon: React.ComponentType
}

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
]

type Props = {
  user: any
}
const AppSideBar = ({
  user,
}: Props) => {
  const pathname = usePathname()
  return (
    <div className="bg-background min-w-[100px] lg:min-w-[300px] h-full"
    >
      <h2 className="flex items-center justify-center lg:justify-start row gap-4 p-4 w-full">
        <AppLogo/>
        <div className="text-2xl font-black text-text-foreground hidden lg:block">
          AI <span className="font-medium">Campaigner</span>
        </div>
      </h2>
     <Menu pathname={pathname}/>
     <DomainMenu user={user} pathname={pathname}/>
     <MenuOptions />
    </div>
  )
}

function Menu({pathname}: {
  pathname: string
}) {
  return (
    <ul>
      {
        links.map(link => (
          <MenuItem
            key={link.href}
            link={link}
            pathname={pathname}
          />
        ))
      }
    </ul>
  )
}
function MenuItem({link, pathname}: {
  link: LinkProp,
  pathname: string
}) {
  const Icon = link.icon
  return (
    <li
      key={link.href}
      className={cn("hover:bg-surface px-4", {'bg-surface': pathname === link.href})}
    >
      <Link 
        href={link.href}
        className={cn("w-full justify-center lg:justify-start flex h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium text-text hover:text-text-foreground")}
      >
        <Icon className="w-6"/>
        <span className="hidden lg:block">
          {link.label}
        </span>
      </Link>
    </li>
  )
}
function MenuOptions() {
  return (
    <div className="bg-background p-4 absolute bottom-0 w-full">
      <Button className="w-full bg-background hover:bg-surface rounded-md flex flex-row gap-2 flex-start">
        <ArrowLeftEndOnRectangleIcon className="w-6 text-text" />
        <Link href="/sign-out" className="text-text text-medium hidden lg:inline-block">
          Sign Out
        </Link>
      </Button>
    </div>
  )
}
export default AppSideBar