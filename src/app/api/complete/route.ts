import { getUserAuth } from '@/actions/auth';
import { getCBKUserClient } from '@/lib/chatbotkit';

import { stream } from '@chatbotkit/next/edge';

export async function POST(req: Request) {
  const { chatbotkitUserId } = await getUserAuth();

  if (!chatbotkitUserId) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  const { model, backstory, datasetId, messages } = await req.json();
  const cbk = getCBKUserClient(chatbotkitUserId);
  const complete = cbk.conversation.complete(null, {
    model,
    backstory,
    datasetId,
    messages,
  });
  return stream(complete);
}

export const runtime = 'edge';
