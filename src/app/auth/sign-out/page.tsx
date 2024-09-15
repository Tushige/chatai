'use client'
import { getAuthId } from '@/actions/auth'
import { currentUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
  const {signOut} = useClerk()
  const router = useRouter()
  useEffect(() => {
    const doSignOut = async () => {
      const a= await signOut()
      // console.log('signout response')
      // console.log(a)
      const user = await getAuthId()
      // console.log('this is id')
      // console.log(user)
    }
    doSignOut()
  }, [])
  return (
    <div>Signing out</div>
  )
}

export default Page