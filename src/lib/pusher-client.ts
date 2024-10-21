import Pusher from 'pusher-js';

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
  cluster: 'us2',
  authEndpoint: '/api/pusher/auth',
  auth: {
    headers: {
      'Authorization': 'Bearer token',
    },
  },
  userAuthentication: {
    endpoint: "/api/pusher/user-auth",
    transport: "ajax",
    params: {},
    headers: {},
  },
})