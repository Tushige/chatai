import { addConversation } from '@/actions/chatbot.action';
import { client } from '@/lib/prisma';

export async function POST(req) {
  const { id, conversationId } = await req.json();
  if (!id || !conversationId) {
    return Response.json(
      JSON.stringify({ status: 400, error: 'missing id or conversationId' })
    );
  }
  try {
    const updatedChatBot = await addConversation(id, conversationId);
    return Response.json(JSON.stringify({ status: 200, data: updatedChatBot }));
  } catch (err) {
    console.error(err);
    return Response.json(JSON.stringify({ status: 400, error: err }));
  }
}
