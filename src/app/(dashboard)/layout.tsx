import { getAuthId } from '@/actions/auth'
import { getAuthUser } from '@/actions/user.action'
import AppSideBar from '@/components/app-sidebar'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Layout = async ({children}: {
  children: React.ReactNode
}) => {
  const clerkId = await getAuthId()
  if (!clerkId) return
  const authUser = await getAuthUser(clerkId)
  if (!authUser) {
    redirect('/')
  }
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="sticky top-0 left-0">
        <AppSideBar domains={authUser.domains} />
      </div>
      <div className="w-full h-screen flex flex-col pl-2 md:pl-4 overflow-y-scroll">
        {children}
      </div>
    </div>
  )
}

export default Layout