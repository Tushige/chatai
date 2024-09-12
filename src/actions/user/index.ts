'use server'
import { client } from '@/lib/prisma'
import { DomainProps } from '@/schemas/domain.schema'
import { auth, currentUser, redirectToSignIn} from '@clerk/nextjs'

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

type createDomainReturn = {
  status: number,
  message: string
}
/**
 * add a Domain document to the User
 */
export const createDomain = async({
  name,
  icon,
  welcomeMessage
}: DomainProps): Promise<createDomainReturn> => {
  const authUser = await currentUser()
  if (!authUser) return {
    status: 400,
    message: 'No Logged in User found'
  }
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: authUser.id
      },
      select: {
        _count: {
          select: {
            domains: true
          }
        },
        subscription: {
          select: {
            plan: true
          }
        }
      }
    })
    const domain = await client.user.findFirst({
      where: {
        clerkId: user.id,
        domains: {
          some: {
            name: name
          }
        }
      }
    })
    if (domain) {
      return {
        status: 400,
        message: 'Domain already exists'
      }
    }
    const planType = user?.subscription?.plan
    // return early if user has reached their max capacity
    if (
      (planType === 'PRO' && user._count.domains > 7) ||
      (planType === 'ULTIMATE' && user._count.domains > 10) ||
      (planType === 'STANDARD' && user._count.domains > 3)) {
        return {
          status: 400,
          message: "You've reached the maximum number of domains. Upgrade your plan to add more domains."
        }
    }
    const createdDomain = await client.user.update({
      where: {
        clerkId: authUser.id
      },
      data: {
        domains: {
          create: {
            name,
            icon,
            chatBot: {
              create: {
                welcomeMessage: "Hi, how are you? Do you have any questions for us?"
              }
            }
          }
        }
      }
    })
    if (createdDomain) {
      return {
        status: 200,
        message: 'Domain Successfully created'
      }
    } else {
      throw Error('Failed creating Domain')
    }

  } catch (err) {
    console.error(err) 
    return {
      status: 400,
      message: 'Failed creating Domain'
    }
  }
}