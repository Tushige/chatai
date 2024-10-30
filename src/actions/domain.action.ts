'use server';
import { client } from '@/lib/prisma';
import { DomainProps } from '@/schemas/domain.schema';
import { getAuthId } from './auth';
import { revalidatePath } from 'next/cache';

const createDomainRecord = async (
  userId: string,
  name: string,
  icon: string,
  questions: {question: string}[]
) => {
  try {
    const domain = await client.domain.create({
      data: {
        name,
        icon, 
        questions: {
          create: questions
        },
        user: {
          connect: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        name: true
      }
    });
    if (!domain) {
      throw new Error('failed to create a new domain');
    }
    return domain;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to get domain with options';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

const getDomainWithOptions = async (domainId: string, select = {}) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId,
      },
      select
    });
    if (!domain) {
      throw Error('failed to fetch Domain');
    }
    return domain;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to get domain with options';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
/**
 * fetches domain record for the /domains/:id page
 */
const getDomain = async (domainId: string) => {
  try {
    const domain = await getDomainWithOptions(domainId, {
      id: true,
      name: true,
      icon: true,
      chatBot: {
        select: {
          id: true,
          welcomeMessage: true,
          icon: true,
          chatBotKitId: true,
        },
      },
      user: {
        select: {
          fullname: true,
          billing: {
            select: {
              stripeCustomerId: true,
            },
          },
        },
      },
    });
    if (!domain) {
      throw new Error('Domain not found');
    }
    return domain;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to get domain';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

const getDomainWithContacts = async (domainId: string) => {
  try {
    const domain = await getDomainWithOptions(domainId, {
      id: true,
      name: true,
      contacts: {
        select: {
          id: true,
          email: true,
        },
      },
    });
    return domain;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to get domain with contacts';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
/**
 * we use this in conversations page to display all conversations for each domain
 */
const getAllDomains = async () => {
  const authId = await getAuthId();
  if (!authId) return;
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: authId,
      },
      select: {
        id: true,
        domains: {
          select: {
            id: true,
            name: true,
            icon: true,
            chatBot: {
              select: {
                chatBotKitId: true,
              },
            },
            contacts: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return user.domains;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch all domains';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

/**
 * update domain settings in the Domain Settings UI
 */
const updateDomain = async (
  id: string,
  { name, icon, welcomeMessage }: DomainProps
) => {
  try {
    const domain = await client.domain.update({
      where: {
        id,
      },
      data: {
        name,
        icon,
        chatBot: {
          update: {
            data: {
              welcomeMessage,
            },
          },
        },
      },
      select: {
        id: true
      }
    });
    if (!domain) {
      throw new Error('Domain update failed');
    }
    return domain;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to update domain';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
const deleteDomain = async (id: string) => {
  try {
    await client.domain.delete({
      where: {
        id,
      },
    });
    revalidatePath('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to delete domain';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
const getUserEmailForDomain = async (domainId: string) => {
  try {
    const domain = await client.domain.findFirst({
      where: {
        id: domainId
      },
      select: {
        user: {
          select: {
            email: true
          }
        }
      }
    });
    if (!domain) {
      throw new Error('Domain not found')
    }
    return domain.user.email;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to get user email for domain';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

export {
  createDomainRecord,
  getDomainWithOptions,
  getDomain,
  getAllDomains,
  updateDomain,
  deleteDomain,
  getDomainWithContacts,
  getUserEmailForDomain
};
