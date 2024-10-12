import React from 'react'
import { getAuthId } from '@/actions/auth'
import { getAuthUser } from '@/actions/user.action'
import AppSideBar from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { redirect } from 'next/navigation'
import AppPublicNavbar from '@/components/app-public-navbar'
import DotPattern from '@/components/magicui/dot-pattern'
import { cn } from '@/lib/utils'

const Layout = async ({children}: {
  children: React.ReactNode
}) => {
  return (
    <div className="bg-background flex flex-col h-screen w-full overflow-hidden">
      <div className="">
        <AppPublicNavbar />
      </div>
      <div className="w-full flex flex-col bg-background text-text">
        <div className="container mx-auto flex px-4 lg:px-8 pt-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout