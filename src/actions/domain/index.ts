'use server'
import { client } from '@/lib/prisma'
import { DomainProps } from '@/schemas/domain.schema'
import { auth, currentUser, redirectToSignIn} from '@clerk/nextjs'

/**
 * fetches domain record for the /domains/:id page 
 */
const getDomain = async(domainId: string) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId
      },
      select: {
        id: true,
        name: true,
        icon: true,
        chatBot: {
          select: {
            id: true,
            welcomeMessage: true,
            icon: true,
            chatBotKitId: true
          }
        },
        user: {
          select: {
            fullname: true,
            billing: {
              select: {
                plan: true
              }
            }
          }
        }
      },
    })
    if (!domain) {
      throw Error('failed to fetch Domain')
    }
    return domain
  } catch (err) {
    return {
      status: 400,
      message: err
    }
  }
}
const updateDomain = async (id, {
  name,
  icon,
  welcomeMessage
}: DomainProps) => {
  try {
    const domain = await client.domain.update({
      where: {
        id
      },
      data: {
        name,
        icon,
        chatBot: {
          update: {
            data: {
              welcomeMessage
            }
          }
        }
      }
    })
    if (!domain) {
      return {
        status: 400,
        message: 'Domain update failed'
      }
    }
    return {
      status: 200,
      message: 'Domain successfully updated'
    }
  } catch (err) {
    console.error(err)
    return {
      status: 400,
      message: err
    }
  }
}
const deleteDomain = async (id) => {
  try {
    const deleted = await client.domain.delete({
      where: {
        id
      }
    })
    if (deleted) {
      return {
        status: 200,
        message: 'successfully deleted domain'
      }
    } else {
      throw Error('failed to delete domain')
    }
  } catch (err) {
    console.error(err) 
    return {
      status: 400,
      message: err
    }
  }
}
export {
  getDomain,
  updateDomain,
  deleteDomain
}

