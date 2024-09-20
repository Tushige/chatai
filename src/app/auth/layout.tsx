import { AuthContext } from '@/context/use-auth-context'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React, { useContext } from 'react'

const layout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  // TODO - uncomment this to prevent authenticated users from accessing the auth flow
  // const {authId} = useContext(AuthContext)
  // if (authId) redirect('/')
  return (
    <div className="h-screen flex w-full justify-center bg-background">
      <div className="w-[600px] flex flex-col items-start p-6">
        {children}
      </div>
      <div className="hidden lg:flex flex-col flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-surface pt-10 pl-24 gap-3">
        <h2 className="md:text-4xl font-bold text-text">
          Hi! I'm Fincent
        </h2>
        <p className="text-text-secondary md:text-sm mb-10">
         I am here to answer any questions that you may have
        </p>
        <Image  
          src="/images/appwrite-dashboard.png"
          unoptimized
          width={0}
          height={0}
          alt='product screenshot'
          sizes="30"
          className="absolute shrink-0 !w-[1600px] top-48"
        />
      </div>
    </div>
  )
}

export default layout