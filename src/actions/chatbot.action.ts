'use server';
import nodemailer from 'nodemailer';
import { client } from '@/lib/prisma';
import cbk from '@/lib/chatbotkit';
import { Questions } from '@prisma/client';
import pusher from '@/lib/pusher';
import { createChatMessage } from './conversations.action';
import { getDomainWithOptions, getUserEmailForDomain } from './domain.action';
import { Message } from '@/ui/conversations/types';

function createBackstory(questions: Partial<Questions>[], domainId: string, domainName: string) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL + `/${domainId}`;
  const backstory = `
  You are a highly knowledgeable, welcoming, and experienced sales representative working for ${domainName}. 
  You will be provided a list of questions that you must ask the customer. Progress the conversation using those questions. Whenever you ask a question from the provided list, you must add a keyword at the end of the question. This keyword is [*]. 
  The list of questions are as follows: ${questions.map(q => q.question).join(', ')}. 
  If the customer agrees to book a product demo, then provide this link: ${bookingUrl}.
  If the customer is unhappy or wishes to speak with a real person, tell them you will get a real person to speak to them and add the keyword (help) at the end of your message.
  Additionally, keep your responses under 3 sentences.`
  return backstory;
  // use this backstory for when you want to be frugal with your tokens
  return `Limit your responses to one sentence. Immediately ask the following questions from customers as soon as they send you a message. Add [Q] at the end of each question. The questions are ${questions.map((q) => q.question).join(', ')}`;
}
async function getCBKChatbot(id: string) {
  try {
    const bot = await cbk.bot.fetch(id);
    if (!bot) {
      throw new Error('Bot not found');
    }
    return bot;
  } catch (err) {
    console.error(err);
  }
}
async function getChatbotByDomainId(domainId: string) {
  try {
    const bot = await client.chatBot.findFirst({
      where: {
        domainId,
      },
      select: {
        id: true,
        chatBotKitId: true,
      },
    });
    if (!bot) {
      throw new Error('bot was not found in the database');
    }
    return bot;
  } catch (err) {
    console.error(err);
  }
}
async function createChatbotForDomain(
  name: string,
  domainId: string,
  domainName: string,
  defaultQuestions: Partial<Questions>[]
) {
  try {
    const bot = await cbk.bot.create({
      name,
      model: 'gpt-3.5-turbo',
      backstory: createBackstory(defaultQuestions, domainId, domainName),
    });
    return bot;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create chatbot';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

async function updateChatbotBackstory(botId: string, questions: Questions[], domainId: string) {
  try {
    const domain = await getDomainWithOptions(domainId, {name: true});
    const res = await cbk.bot.update(botId, {
      backstory: createBackstory(questions, domainId, domain.name),
    });
    if (res.id) {
      return {
        status: 200,
        message: 'succesfully updated bot',
      };
    } else {
      throw new Error('Failed to update the bot');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to update chatbot backstory';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}
/**
 * when user initiates a conversation, we create a conversation on chatbotkit then save the id in our db
 */
const addConversation = async (id: string, conversationId: string) => {
  try {
    const updatedChatBot = await client.chatBot.update({
      where: {
        id,
      },
      data: {
        conversationIds: {
          push: conversationId,
        },
        textColor: 'red',
      },
    });
    if (!updatedChatBot) {
      throw new Error('Failed to add conversation id to the chatbot');
    }
    return {
      status: 200,
      message: 'success',
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to add conversation';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

/**
 *
 * when we get customer email, we need to be able to display all messages related to that email.
 * We do that by adding the email address to the conversation record. Then all messages in this conversation will be associated with the email.
 *
 * WIP - this method is currently unused because ChatBotKit API endpoint is broken.
 */
const addContactToConversation = async (
  conversationId: string,
  email: string
) => {
  try {
    const res = await cbk.conversation.update(conversationId, {
      meta: {
        email,
      },
    });
    if (res && res.id) {
      return {
        status: 200,
        message: 'successfully added email to conversation',
      };
    } else {
      throw new Error('failed to add email to conversation');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to add contact to conversation';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
};

export {
  getChatbotByDomainId,
  createChatbotForDomain,
  getCBKChatbot,
  updateChatbotBackstory,
  addConversation,
  addContactToConversation,
};

export const createConversation = async (domainId: string) => {
  try {
    const conversation = await client.conversation.create({
      data: {
        domain: {
          connect: {
            id: domainId
          }
        }
      }
    });
    if (!conversation) {
      throw new Error('failed to create a conversation');
    }
    return conversation;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create conversation';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}
/**
 * Logic related to realtime communication between customer and live representative
 */
export const sendLiveMessage = async ({
  text,
  conversationId,
  type,
  link
}: Message & {
  conversationId: string
}) => {
  try { 
    await createChatMessage(conversationId, text, type, link ?? false);
    await pusher.trigger(`channel-${conversationId}`, 'message', {
      text,
      conversationId,
      type,
      link,
      createdAt: new Date()
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to send live message';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

export const sendStatus = async ({
  online,
  conversationId,
  type
}: {
  online: boolean,
  conversationId: string,
  type: string
}) => {
  try {
    await pusher.trigger(`channel-${conversationId}`, 'status', {
      online,
      conversationId,
      type
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to send realtime message';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

export async function sendNotificationEmail(domainId: string) {
  try {
    // grab the user record associated with the domain.
    const email = await getUserEmailForDomain(domainId);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASS,
      },
    });
    const mailConfig = {
      to: email,
      subject: '[Chat AI] Notification',
      text: 'Customer requires your assistance',
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailConfig, async (err) => {
        if (err) {
          console.error(err);
          return reject({ message: 'Failed to send email' });
        }
        return resolve({
          status: 200,
          message: 'Email Sent!',
        });
      });
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to send notification email';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}