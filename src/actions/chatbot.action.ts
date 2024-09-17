'use server'
import ChatBotKit from "@chatbotkit/sdk"
import { client } from '@/lib/prisma'
import { getUserAuth } from "./auth"
import cbk, { getCBKUserClient } from '@/lib/chatbotkit'
import { clerkClient } from "@clerk/nextjs/server"

/**
 * return chatbotkitUserId, if it exists. Otherwise create it.
 */
async function ensureChatBotKitUserId(): Promise<string> {
  const {userId, chatbotkitUserId} = await getUserAuth()
  if (chatbotkitUserId) {
    return chatbotkitUserId
  }
  const {id} = await cbk.partner.user.create({})
  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      chatbotkitUserId: id
    }
  })
  return id
}

async function getChatBotKitUserClient(): Promise<ChatBotKit> {
  const chatbotkitUserId = await ensureChatBotKitUserId()
  return getCBKUserClient(chatbotkitUserId)
}

async function getChatbot(id: string) {
  try {
    const bot = cbk.bot.fetch(id)
    if (!bot) {
      throw new Error('Bot not found')
    }
    return bot
  } catch (err) {
    console.error(err)
  }
}

async function createChatbotForDomain(name: string) {
  try {
    const bot = await cbk.bot.create({
      name,
      model: 'gpt-3.5-turbo',
      backstory: `You are a customer service representative who is formal and polite`
    })
    return bot
  } catch (err) {
    console.error(err)
    return null;
  }
}
/**
 * when user initiates a conversation, we create a conversation on chatbotkit then save the id in our db
 */
const addConversation = async (id: string, conversationId: string) => {
  try {
    const updatedChatBot = await client.chatBot.update({
      where: {
        id
      },
      data: {
        conversations: {
          push: conversationId
        },
        textColor: 'red'
      }
    })
    if (!updatedChatBot) {
      throw new Error('Failed to add conversation id to the chatbot')
    }
    return {
      status: 200,
      message: 'success'
    }
  } catch (err) {
    console.error(err)
    return {
      status: 400,
      message: err
    }
  }
}
const getMessages = async (conversationId: string) => {
  try {
    // const cbk = await getChatBotKitUserClient()
    const messages = await cbk.conversation.message.list(conversationId)
    return messages
  } catch (err) {
    console.error(err)
  }
}
export {
  getChatBotKitUserClient,
  createChatbotForDomain,
  getChatbot,
  getMessages,
  addConversation
}