'use server'
import { client } from '@/lib/prisma'
import { currentUser, redirectToSignIn} from '@clerk/nextjs'

/*
 create a user in the database
*/
export const createUser = async (
  fullname: string,
  clerkId: string,
  type: string
) => {
  try {
    const registered = await client.user.create({
      data: {
        fullname,
        clerkId,
        type,
        subscription: {
          create: {}
        }
      },
      select: {
        fullname: true,
        id: true,
        type: true
      }
    })
    if (registered) {
      return {
        status: 200,
        user: registered
      }
    }
  } catch (err) {
    return {
      status: 400
    }
  }
}

export const getAuthUser = async(clerkId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId
      },
      select: {
        fullname: true,
        id: true,
        type: true,
        domains: {
          select: {
            name: true,
            icon: true,
            id: true,
            customer: {
              select: {
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                  },
                },
              },
            },
          },
        },
      }
    })
    return user;
  } catch (err) {
    return {
      status: 400
    }
  }
}