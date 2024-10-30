'use server'
import { client } from "@/lib/prisma"
import { Conversation } from "@prisma/client";

export const updateConversation = async (conversationId: string, data: Conversation) => {
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'update conversation';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch conversations';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to get conversation';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
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
        link: true,
        seen: true,
        createdAt: true
      }
    })
    return messages;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to fetch messages';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}

export const createChatMessage = async (conversationId: string, text: string, type: string, link: boolean) => {
  try {
    const chatMessage = await client.ChatMessage.create({
      data: {
        text,
        type,
        link,
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message); // Safe to access `message`
      throw new Error(err.message);
    } else {
      const errorMsg = 'Failed to create a new chat message';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }
}