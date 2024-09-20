import cbk from '@/lib/chatbotkit'
/**
 * Creates a conversation ID and conversation Session
 */
export async function POST(req) {
  const {botId} = await req.json()
  /*
   * passing botId allows bot with this id to respond to messages. 
   * general flow is to specify backstory on the bot and create a conversation with specific bot id.
   */
  const {id: conversationId} = await cbk.conversation.create({botId})
  const {token} = await cbk.conversation.session.create(conversationId, {
    durationInSeconds: 3600
  })
  return Response.json({conversationId, token})
}
