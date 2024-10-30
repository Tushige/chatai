'use server';
import { client } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { createChatbotForDomain } from './chatbot.action';
import { getPlan } from './plan.action';
import { createDomainRecord } from './domain.action';

const DEFAULT_QUESTIONS = [
  {
    question: 'What are your goals?',
  },
  {
    question: 'What is your email?',
  },
];
/*
 create a user in the database
*/
const createUser = async ({
    fullname,
    email,
    clerkId,
    type,
    stripeCustomerId,
  } : {
  fullname: string,
  email: string,
  clerkId: string,
  type: string,
  stripeCustomerId: string
}) => {
  // every new user will be created on the Free tier
  const freePlan = await getPlan('FREE');
  try {
    const registered = await client.user.create({
      data: {
        fullname,
        email,
        clerkId,
        type,
        billing: {
          create: {
            stripeCustomerId,
            plan: {
              connect: {
                id: freePlan.id,
              },
            },
          },
        },
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    });
    if (registered) {
      return {
        status: 200,
        user: registered,
      };
    } else {
      throw new Error('registration failed');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create User';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

const getUserBilling = async (clerkId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
        fullname: true,
        type: true,
        billing: {
          select: {
            id: true,
            stripeCustomerId: true,
            plan: {
              select: {
                id: true,
                name: true,
                emailLimit: true,
                domainLimit: true
              }
            }
          },
        },
      },
    });
    if (!user) {
      throw new Error('Failed to get the current user');
    }
    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch user billing';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

const getAuthUser = async (clerkId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId,
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
          },
        },
        billing: {
          select: {
            plan: {
              select: {
                name: true,
                domainLimit: true,
                emailLimit: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch auth user';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};
type createDomainReturn = {
  status: number;
  message: string;
};
/**
 * add a Domain document to the User
 * 
 * 1. create domain
 * 2. create chatbot
 * 3. add the chatbot id to the created domain
 */
const createDomain = async ({
  name,
  botName,
  icon,
}: {
  name: string,
  botName: string,
  icon: string
}): Promise<createDomainReturn> => {
  const authUser = await currentUser();
  if (!authUser)
    throw new Error('No logged in user found')
  try {
    // we need the user record's id so we find a user with matching auth id (i.e. clerk)
    const user = await client.user.findUnique({
      where: {
        clerkId: authUser.id,
      },
      select: {
        id: true,
        _count: {
          select: {
            domains: true,
          },
        },
      },
    });
    // check if we already have a domain with the provided name 
    const domain = await client.domain.findFirst({
      where: {
        userId: user.id,
        name
      },
      select: {
        id: true
      }
    })
    if (domain) {
      throw new Error('domain already exists')
    }
    let createdDomain = await createDomainRecord(
      user.id,
      name,
      icon,
      DEFAULT_QUESTIONS
    );
    if (!createdDomain) {
      throw Error('Failed creating Domain');
    }
    // TODO - check if user has reached maximum capacity on their plan.
    // create default bot questions
    const bot = await createChatbotForDomain(botName, createdDomain.id, createdDomain.name, DEFAULT_QUESTIONS);
    if (!bot) {
      throw new Error('Failed to create Bot');
    }
    // add the bot to the domain
    createdDomain = await client.domain.update({
      where: {
        id: createdDomain.id,
      },
      data: {
        chatBot: {
          create: {
            welcomeMessage: 'Hi, how are you? Do you have any questions for us?',
            chatBotKitId: bot?.id,
          },
        },
      },
      select: {
        id: true
      }
    });
    if (!createdDomain) {
      throw new Error('failed to add bot to the domain')
    }

    return createdDomain;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create domain';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

export { createUser, getUserBilling, getAuthUser, createDomain };
