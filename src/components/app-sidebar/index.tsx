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
import { DomainMenu } from './domain/domain'
import { Domain } from '@/schemas/domain.schema'

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
    label: 'Marketing',
    href: '/marketing',
    icon: ChartBarIcon,
  },
]

type Props = {
  domains: Domain[] | null | undefined
}
const AppSideBar = ({
  domains
}: Props) => {
  const pathname = usePathname()
  return (
    <div className="bg-background min-w-[100px] md:min-w-[300px] relative">
      <h2 className="flex items-center justify-center md:justify-start row gap-4 p-4 w-full">
        <AppLogo/>
        <div className="text-2xl font-black hidden md:block">
          ENVISION <span className="font-medium">AI</span>
        </div>
      </h2>
     <Menu pathname={pathname}/>
     <DomainMenu domains={domains}/>
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
      className={cn("hover:bg-muted px-4", {'bg-muted': pathname === link.href})}
    >
      <Link 
        href={link.href}
        className={cn("w-full justify-center md:justify-start flex h-[48px] grow items-center gap-2 rounded-md p-3 text-sm font-medium")}
      >
        <Icon className="w-6"/>
        <span className="hidden md:block">
          {link.label}
        </span>
      </Link>
    </li>
  )
}
function MenuOptions() {
  return (
    <div className="bg-background p-4 absolute bottom-0 w-full">
      <Button className="w-full bg-background rounded-md flex flex-row gap-2 flex-start hover:bg-muted">
        <ArrowLeftEndOnRectangleIcon className="w-6 text-foreground" />
        <Link href="/auth/sign-out" className="text-foreground text-medium hidden md:inline-block">
          Sign Out
        </Link>
      </Button>
    </div>
  )
}
export default AppSideBar