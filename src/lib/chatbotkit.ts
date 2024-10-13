import { getUserAuth } from '@/actions/auth';
import { stream } from '@chatbotkit/next/edge';
import { ChatBotKit } from '@chatbotkit/sdk';
import { clerkClient } from '@clerk/nextjs';

import { z } from 'zod';
export { ChatBotKit };
// const env = z
//   .object({
//     CHATBOTKIT_API_KEY: z.string()
//   })
//   .parse(process.env)

export const cbk = new ChatBotKit({
  secret: process.env.CHATBOTKIT_API_KEY!,
});
/**
 *
 * @param userId
 * @returns
 */
export function getCBKUserClient(userId: string) {
  return new ChatBotKit({
    secret: process.env.CHATBOTKIT_API_KEY!,
    runAsUserId: userId,
  });
}

export async function getChatBotKitUserClient(): Promise<ChatBotKit> {
  const chatbotkitUserId = await ensureChatBotKitUserId();
  return getCBKUserClient(chatbotkitUserId);
}

/**
 * return chatbotkitUserId, if it exists. Otherwise create it.
 */
async function ensureChatBotKitUserId(): Promise<string> {
  const { userId, chatbotkitUserId } = await getUserAuth();
  if (chatbotkitUserId) {
    return chatbotkitUserId;
  }
  const { id } = await cbk.partner.user.create({});
  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      chatbotkitUserId: id,
    },
  });
  return id;
}

export default cbk;
