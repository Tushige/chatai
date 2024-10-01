'use server'
import { client } from '@/lib/prisma'
import { DomainProps } from '@/schemas/domain.schema'
import { currentUser} from '@clerk/nextjs'
import { createChatbotForDomain } from './chatbot.action'


const DEFAULT_QUESTIONS = [
  {
    question: "What are your goals?"
  },
  {
    question: "What is your email?"
  }
]
/*
 create a user in the database
*/
const createUser = async (
  fullname: string,
  clerkId: string,
  type: string,
  stripeCustomerId: string
) => {
  try {
    const registered = await client.user.create({
      data: {
        fullname,
        clerkId,
        type,
        billing: {
          create: {
            stripeCustomerId
          }
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
    } else {
      throw new Error('registration failed')
    }
  } catch (err) {
    return {
      status: 400
    }
  }
}

const getUserBilling = async (clerkId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId
      },
      select: {
        id: true,
        fullname: true,
        type: true,
        billing: {
          select: {
            id: true,
            stripeCustomerId: true,
          }
        }
      }
    })
    if (!user) {
      throw new Error('Failed to get the current user')
    }
    return user;
  } catch (err) {
    throw new Error(err)
  }
}

const getAuthUser = async(clerkId: string) => {
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
            id: true
          },
        },
      }
    })
    return user;
  } catch (err) {
    console.error(err)
    return {
      status: 400,
      message: err
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
const createDomain = async({
  name,
  botName,
  icon,
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
    // TODO - check if user has reached maximum capacity on their plan.
    // create default bot questions
    const bot = await createChatbotForDomain(botName, DEFAULT_QUESTIONS)
    
    if (!bot) {
      throw new Error('Failed to create Bot')
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
                welcomeMessage: "Hi, how are you? Do you have any questions for us?",
                chatBotKitId: bot?.id
              }
            },
            questions: {
              create: DEFAULT_QUESTIONS
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

export {
  createUser,
  getUserBilling,
  getAuthUser,
  createDomain
}