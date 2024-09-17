import cbk from '@/lib/chatbotkit'
/**
 * Creates a conversation ID and conversation Session
 */
export async function GET() {
  const {id: conversationId} = await cbk.conversation.create({})
  const {token} = await cbk.conversation.session.create(conversationId, {
    durationInSeconds: 3600
  })
  // we need to save a reference to this conversation in our domain so that we can fetch the messages later
  // return res.status(200).json({
  //   conversationId,
  //   token
  // })
  return Response.json({conversationId, token})
}
