'use server';
import { client } from '@/lib/prisma';
import cbk from '@/lib/chatbotkit';
import { Questions } from '@prisma/client';
import pusher from '@/lib/pusher';
import { createChatMessage } from './conversations.action';

function createBackstory(questions: Questions[]) {
  // return `You are a highly knowledgeable, welcoming, and experienced sales representative. You will be provided a list of questions that you must ask the customer.Progress the conversation using those questions. Whenever you ask a question from the provided list, you must add a keyword at the end of the question. This keyword is [*]. The list of questions is as follows: ${questions.map(q => q.question).join(', ')} Lastly, always start a conversation with the phrase howdy.`
  // return `You will be provided a list of questions that you must ask the customer.Progress the conversation using those questions. Whenever you ask a question from the provided list, you must add a keyword at the end of the question. This keyword is [*]. The list of questions is as follows: ${questions.map(q => q.question).join(', ')}`
  return `Limit your responses to one sentence. Immediately ask the following questions from customers as soon as they send you a message. Add [Q] at the end of each question. The questions are ${questions.map((q) => q.question).join(', ')}`;
}
async function getChatbot(id: string) {
  try {
    const bot = cbk.bot.fetch(id);
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
  defaultQuestions: Questions[]
) {
  try {
    const bot = await cbk.bot.create({
      name,
      model: 'gpt-3.5-turbo',
      backstory: createBackstory(defaultQuestions),
    });
    return bot;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
async function updateChatbotBackstory(botId: string, questions: Questions[]) {
  try {
    const res = await cbk.bot.update(botId, {
      backstory: createBackstory(questions),
    });
    if (res.id) {
      return {
        status: 200,
        message: 'succesfully updated bot',
      };
    } else {
      throw new Error('Failed to update the bot');
    }
  } catch (err) {
    throw new Error(err);
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
  } catch (err) {
    console.error(err);
    throw new Error(err);
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
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      message: 'Failed to add email to conversation meta',
    };
  }
};
const getConversation = async (conversationId: string) => {
  try {
    const res = await cbk.conversation.fetch(conversationId);
    if (res && res.code) {
      throw new Error('Failed to fetch conversation');
    }
    return res;
  } catch (err) {
    console.error(err);
    return {
      status: 400,
      message: err,
    };
  }
};
const getMessages = async (conversationId: string) => {
  try {
    // const cbk = await getChatBotKitUserClient()
    const messages = await cbk.conversation.message.list(conversationId, {
      order: 'asc',
    });
    return messages;
  } catch (err) {
    console.error(err);
    return [];
  }
};
export {
  getChatbotByDomainId,
  createChatbotForDomain,
  getChatbot,
  getConversation,
  getMessages,
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
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}
export const getConversationRecord = async (id: string) => {
  try {
    const conversation = await client.conversation.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        live: true
      }
    });
    if (!conversation) {
      throw new Error('Requested conversation not found')
    }
    return conversation;
  } catch (err) {
    console.error(err)
  }
}
/**
 * Logic related to realtime communication between customer and live representative
 */
export const sendLiveMessage = async ({
  text,
  conversationId,
  type
}: {
  text: string,
  conversationId: string,
  type: string
}) => {
  try { 
    await createChatMessage(conversationId, text, type);
    const res = await pusher.trigger(`channel-${conversationId}`, 'message', {
      text,
      conversationId,
      type,
      createdAt: new Date()
    })
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const sendStatus = async ({
  online,
  conversationId,
  type
}) => {
  try {
     const res = await pusher.trigger(`channel-${conversationId}`, 'status', {
      online,
      conversationId,
      type
     })
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const sendCustomerStatus = async ({
  online, 
  conversationId,
  type
}) => {
  try {
    const res = await pusher.trigger(`customer-status`, 'message', {
     online,
     conversationId,
     type
    })
 } catch (err) {
   console.error(err)
   throw new Error(err)
 }
}