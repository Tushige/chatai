'use server';
import { client } from '@/lib/prisma';
import { DomainProps } from '@/schemas/domain.schema';
import { getAuthId } from './auth';

const getDomainWithOptions = async (domainId: string, select = {}) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId,
      },
      select,
    });
    if (!domain) {
      throw Error('failed to fetch Domain');
    }
    return domain;
  } catch (err) {
    console.error(err);
    throw new Error(err);
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
    return domain;
  } catch (err) {
    return {
      status: 400,
      message: err,
    };
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
  } catch (err) {
    console.error(err);
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
                conversationIds: true,
              },
            },
            contacts: {
              select: {
                id: true,
                email: true,
                conversationIds: true,
              },
            },
          },
        },
      },
    });
    return user.domains;
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      message: 'Failed to fetch all domains',
    };
  }
};

/**
 * update domain settings in the Domain Settings UI
 */
const updateDomain = async (
  id,
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
    });
    if (!domain) {
      return {
        status: 400,
        message: 'Domain update failed',
      };
    }
    return {
      status: 200,
      message: 'Domain successfully updated',
    };
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      message: err,
    };
  }
};
const deleteDomain = async (id) => {
  try {
    const deleted = await client.domain.delete({
      where: {
        id,
      },
    });
    if (deleted) {
      return {
        status: 200,
        message: 'successfully deleted domain',
      };
    } else {
      throw Error('failed to delete domain');
    }
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      message: err,
    };
  }
};

export {
  getDomain,
  getAllDomains,
  updateDomain,
  deleteDomain,
  getDomainWithContacts,
};
