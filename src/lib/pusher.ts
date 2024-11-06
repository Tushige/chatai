import Pusher from 'pusher'

console.log('[pusher.ts] env vars were using')
console.log(`pusher app id - ${process.env.PUSHER_APP_ID}`)
console.log(`NEXT_PUBLIC_PUSHER_APP_KEY - ${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`)
console.log(`PUSHER_APP_SECRET - ${process.env.PUSHER_APP_SECRET}`)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: 'us2',
  useTLS: true
});

export default pusher;