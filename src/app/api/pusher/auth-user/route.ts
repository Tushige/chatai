import pusher from '@/lib/pusher';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req, res) {
  try {
    const data = await req.formData();
    const socket_id = data.get('socket_id')
    const channel_name = data.get('channel_name')
    const pusherResponse= pusher.authenticateUser(socket_id, {
      id: uuidv4(),
      user_info: {
        name: 'Anon'
      }
    })
    const auth = JSON.stringify(pusherResponse);
    return new Response(JSON.stringify(auth), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    console.error(err)
    return Response.json(JSON.stringify({status: 403, error: 'Failed to auth pusher'}))
  }
}
