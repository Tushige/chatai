import { addConversation, createConversation } from '@/actions/chatbot.action';
import { CHATBOT_TOKEN_DURATION } from '@/app/constants';
import cbk from '@/lib/chatbotkit';
/**
 * Creates a conversation ID and conversation Session
 */
// TODO - uncomment when ready to integrate CBK into Chat

export async function GET(req) {
  // const {botId} = await req.json()
  const {searchParams} = new URL(req.url)
  const cbkbotId = searchParams.get('cbkbotId')
  const domainBotId = searchParams.get('domainBotId')
  const domainId = searchParams.get('domainId');
  if (!domainId || !domainBotId || !cbkbotId) {
    console.log('invalid arguments')
    return Response.json(JSON.stringify({status: 400, error: 'Invalid arguments'}))
  }
  /*
   * passing botId allows bot with this id to respond to messages.
   * general flow is to specify backstory on the bot and create a conversation with specific bot id.
   */
  console.log('REQUESTING SESSION FROM CBK')
  /**
   * 1. create conversation record on CBK
   * 2. create a conversation session on CBK
   * 3. create a conversation record in our DB
   * 4. return { conversationId, token } - necessary to chat with the bot
   */
  try {
    // TODO - uncomment when you want to resume normal operation
    // const {id: cbk_conversation_id} = await cbk.conversation.create({botId: cbkbotId})
    // TODO - delete later. we're reusing the same converation so we stay under plan limits.
    const cbk_conversation_id = 'dn1ni2te4v80e2dvo8modrmi';
    const {token} = await cbk.conversation.session.create(cbk_conversation_id, {
      durationInSeconds: CHATBOT_TOKEN_DURATION
    })
    // save the created conversation to our db
    await addConversation(domainBotId, cbk_conversation_id)
    const conversation = await createConversation(domainId);
    return Response.json({conversation, cbk_conversation_id, token})
  } catch (error) {
    console.error(error)
    return Response.json(JSON.stringify({status: 400, error}))
  }
}

/**
 * TODO: migrate to the function above. This is a placeholder function to generate conversation id and token so that we don't use up our plan limit.
 */
// export async function GET(req) {
//   // const {botId} = await req.json()
//   const { searchParams } = new URL(req.url);
//   const cbkbotId = searchParams.get('cbkbotId');
//   const domainBotId = searchParams.get('domainBotId');
//   const domainId = searchParams.get('domainId');
//   if (!domainBotId || !cbkbotId || !domainId)  {
//     return Response.json(
//       JSON.stringify({ status: 400, error: 'Invalid arguments' })
//     );
//   }

//   try {
//     const conversation = await createConversation(domainId);
//     return new Response(JSON.stringify({
//       conversation,
//       cbk_conversation_id: 'cbk-conversation-id-placeholder',
//       token: uuidv4()
//     }), {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     return Response.json(JSON.stringify({ status: 400, error }));
//   }
// }
