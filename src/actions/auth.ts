'use server'
import { currentUser } from "@clerk/nextjs"
import {auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from "next/navigation"

type UserAuthType = {
  userId: string,
  chatbotkitUserId?: string | null
}
/**
 * 
 * we return the id because that's all we need to fetch our user object from the database.
 * I decided to not return the user record right away since different pages want to query the user record differently.
 */
const getAuthId = async () => {
  // const clerkUser = await currentUser()
  // return clerkUser?.id || null
  const {userId} = auth()
  return userId
}

async function getUserAuth(): Promise<UserAuthType> {
  const {userId} = auth()
  if (!userId) {
    return redirect('/')
  }
  const user = await clerkClient.users.getUser(userId)
  if (!user) {
    return redirect('/') // @todo redirect to specific page
  }
  const chatbotkitUserId = user.privateMetadata.chatbotkitUserId as string
  return {
    userId,
    chatbotkitUserId
  }
}
export {
  getAuthId,
  getUserAuth
}