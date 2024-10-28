'use server'
import { client } from "@/lib/prisma"

export const updateConversationLive = async (conversationId: string, live: boolean) => {
  try {
    const conversation = await client.conversation.update({
      where: {
        id: conversationId,
      }, 
      data: {
        live
      }
    })
    return conversation;
  } catch (err) {
    console.error(err)
  }
}

export const updateConversation = async (conversationId: string, data: Object) => {
  try {
    const conversation = await client.conversation.update({
      where: {
        id: conversationId
      },
      data
    })
    if (!conversation) {
      throw new Error('Failed to updated conversation')
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

export const getConversations = async (domainId: string) => {
  try {
    const conversations = await client.conversation.findMany({
      where: {
        domainId
      },
      select: {
        id: true,
        live: true,
        createdAt: true,
        _count:{
          select: {
            messages: true
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            text: true,
            type: true,
            seen: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return conversations;
  } catch (err) {
    console.error(err)
    throw new Error(err);
  }
}
export const getConversation = async (conversationId: string) => {
  try {
    const conversation = await client.conversation.findFirst({
      where: {
        id: conversationId
      },
      select: {
        id: true,
        createdAt: true,
        _count: {
          select: {
            messages: true
          }
        },
      }
    })
    if (!conversation) {
      throw new Error('failed to fetch conversation');
    }
    return conversation;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
export const getChatMessages = async (conversationId: string) => {
  try {
    const messages = await client.ChatMessage.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        text: true,
        type: true,
        seen: true,
        createdAt: true
      }
    })
    return messages;
  } catch (err) {
    console.error(err);
    throw new Error(err)
  }
}

export const createChatMessage = async (conversationId: string, text: string, type: string) => {
  try {
    const chatMessage = await client.ChatMessage.create({
      data: {
        text,
        type,
        seen: true,
        conversation: {
          connect: {
            id: conversationId
          }
        }
      },
    })
    if (!chatMessage) {
      throw new Error('Failed to create a new chat message')
    }
    return chatMessage;
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}