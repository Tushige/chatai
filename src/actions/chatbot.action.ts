import ChatBotKit from "@chatbotkit/sdk"
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


export {
  getChatBotKitUserClient,
  createChatbotForDomain,
  getChatbot
}