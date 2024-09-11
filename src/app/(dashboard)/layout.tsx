import { getAuthUser } from '@/actions/user'
import AppSideBar from '@/components/app-sidebar'
import { currentUser } from '@clerk/nextjs'
import React from 'react'

const Layout = async ({children}: {
  children: React.ReactNode
}) => {
  const clerkUser = await currentUser()
  if (!clerkUser) return
  const authUser = await getAuthUser(clerkUser.id)
  return (
    <div className="flex h-screen w-full">
      <AppSideBar domains={authUser.domain} />
      <div className="w-full h-screen flex flex-col pl-20 md:pl-4">
        {children}
      </div>
    </div>
  )
}

export default Layout