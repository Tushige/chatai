import pusher from '@/lib/pusher';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req) {
  const {soket_id, callback} = await req.json()
  const user = {
    id: uuidv4(),
    user_info: {
      name: 'anonymous'
    }
  };
  const auth = JSON.stringify(pusher.authenticateUser(soket_id, user));
  const cb = callback.replace(/\\"/g,"") + "(" + auth + ");";
  return Response.json(cb);
}
