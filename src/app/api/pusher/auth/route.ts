import pusher from '@/lib/pusher';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'

export async function POST(req, res) {
  try {
    const cookieStore = cookies()
    const isAssistant = cookieStore.get('__session');
    const data = await req.formData();
    const socket_id = data.get('socket_id')
    const channel_name = data.get('channel_name')
    const conversationId = data.get('conversation_id')
    const userId = uuidv4();
    const pusherResponse= pusher.authorizeChannel(socket_id, channel_name, {
      user_id: conversationId || userId,
      user_info: {
        role: isAssistant ? 'assistant' : 'user',
        conversationId: conversationId || null
      }
    });
    const auth = JSON.stringify(pusherResponse);
    return new Response(auth, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.error(err)
    return Response.json(JSON.stringify({status: 403, error: 'Failed to authorize pusher channel'}))
  }
}
