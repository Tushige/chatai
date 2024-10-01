import AppSectionTitle from '@/components/app-section-title'
import { Separator } from '@/components/ui/separator'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const links = [
  {
    href: '/settings/membership',
    label: 'Manage membership'
  },
  {
    href: '/settings/themes',
    label: 'Themes'
  },
  {
    href: '/settings/password',
    label: 'Change Password'
  },
]
const SettingsPage = () => {
  return (
    <div>
      <h1 className="font-bold text-4xl">
        Settings
      </h1>        
      <h2 className="font-medium text-secondary mt-4 mb-4">
        Quick Links
      </h2>
      <div className="border-border rounded-md bg-surface p-2 max-w-[50rem]">
        <ul className="flex flex-col">
          {
            links.map((link, idx) => (
              <div key={link.href}>
                <Link href={link.href} className="flex flex-row justify-between py-4 px-2 w-full h-full rounded-md hover:bg-hover">
                  <span>{link.label}</span>
                  <ArrowRight className="size-6 text-secondary opacity-50"/>
                </Link>
                {
                  idx < links.length - 1 && (
                    <Separator className="border-border"/>
                  )
                }
              </div>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default SettingsPage