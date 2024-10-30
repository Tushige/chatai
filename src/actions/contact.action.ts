'use server';
import { client } from '@/lib/prisma';

export const upsertContact = async ({
  email,
  domainId,
}: {
  email: string;
  domainId: string;
}) => {
  try {
    let contact = await client.contact.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (contact) {
      return contact;
    }
    contact = await client.contact.create({
      data: {
        email,
        domain: {
          connect: {
            id: domainId,
          },
        },
      },
    });
    return contact;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to upsert contact';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

// creates a new contact from a conversation
export const createContact = async ({
  email,
  domainId,
  conversationId,
}: {
  email: string;
  domainId: string;
  conversationId: string;
}) => {
  try {
    const contact = await client.contact.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (contact) {
      // contact already exists. associate the contact with the conversation. 
      await client.conversation.update({
        where: {
          id: conversationId
        },
        data: {
          contact: {
            connect: {
              id: contact.id
            }
          }
        }
      })
      return contact;
    } else {
      const newContact = await client.contact.create({
        data: {
          email,
          domain: {
            connect: {
              id: domainId,
            },
          },
          conversations: {
            connect: {
              id: conversationId
            }
          }
        },
      });
      return newContact;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create contact';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
