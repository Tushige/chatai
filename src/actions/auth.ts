'use server'
import { currentUser } from "@clerk/nextjs"

/**
 * 
 * we return the id because that's all we need to fetch our user object from the database.
 * I decided to not return the user record right away since different pages want to query the user record differently.
 */
const getAuthId = async () => {
  const clerkUser = await currentUser()
  return clerkUser?.id || null
}

export {
  getAuthId
}