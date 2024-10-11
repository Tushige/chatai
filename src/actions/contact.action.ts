'use server'
import { client } from '@/lib/prisma'

export const upsertContact = async ({email, domainId}: {
  email: string,
  domainId: string
}) => {
  try {
    let contact = await client.contact.findFirst({
      where: {
        email
      },
      select: {
        id: true
      }
    })
    if (contact) {
      return contact
    }
    contact = await client.contact.create({
      data: {
        email,
        domain: {
          connect: {
            id: domainId
          }
        }
      }
    })
    return contact;
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// creates a new contact from a conversation
export const createContact = async ({
  email,
  domainId,
  conversationId
}: {
  email: string,
  domainId: string,
  conversationId: string
}) => {
  try { 
    let contact = await client.contact.findFirst({
      where: {
        email
      },
      select: {
        conversationIds: true
      }
    })
    if (contact) {
      // customer already exists. Check if provided conversationId already exists
      const isExistingConversation = contact.conversationIds?.includes(conversationId)
      // if it's a new conversation add it to the conversationIds list
      if (!isExistingConversation) {
        contact = await client.contact.update({
          where: {
            id: contact.id
          },
          data: {
            conversationIds: {
              push: conversationId
            }
          }
        })
      }
      return contact
    } else {
      const newContact = await client.contact.create({
        data: {
          email,
          conversationIds: [conversationId],
          domain: {
            connect: {
              id: domainId
            }
          }
        }
      })
      return newContact
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}