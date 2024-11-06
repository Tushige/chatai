import Pusher from 'pusher-js';

console.log('[pusher-client.ts] env vars were using')
console.log(`NEXT_PUBLIC_PUSHER_APP_KEY - ${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`)

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