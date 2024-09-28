import {v4 as uuidv4} from 'uuid'
import { addConversation } from '@/actions/chatbot.action'
import { CHATBOT_TOKEN_DURATION } from '@/app/constants'
import cbk from '@/lib/chatbotkit'
/**
 * Creates a conversation ID and conversation Session
 */
// TODO - uncomment when ready to integrate CBK into Chat

// export async function GET(req) {
//   // const {botId} = await req.json()
//   const {searchParams} = new URL(req.url)
//   const cbkbotId = searchParams.get('cbkbotId')
//   const domainBotId = searchParams.get('domainBotId')
//   if (!domainBotId || !cbkbotId) {
//     console.log('invalid arguments')
//     return Response.json(JSON.stringify({status: 400, error: 'Invalid arguments'}))
//   }
//   /*
//    * passing botId allows bot with this id to respond to messages. 
//    * general flow is to specify backstory on the bot and create a conversation with specific bot id.
//    */
//   console.log('REQUESTING SESSION FROM CBK')
//   /**
//    * 1. create conversation record on CBK
//    * 2. create a conversation session on CBK
//    * 3. create a conversation record in our DB
//    * 4. return { conversationId, token } - necessary to chat with the bot
//    */
//   try {
//     const {id: conversationId} = await cbk.conversation.create({botId: cbkbotId})
//     const {token} = await cbk.conversation.session.create(conversationId, {
//       durationInSeconds: CHATBOT_TOKEN_DURATION
//     })
//     // save the created conversation to our db
//     await addConversation(domainBotId, conversationId)
//     return Response.json({conversationId, token})
//   } catch (error) {
//     console.error(error)
//     return Response.json(JSON.stringify({status: 400, error}))
//   }
// }

/**
 * TODO: migrate to the function above. This is a placeholder function to generate conversation id and token so that we don't use up our plan limit.
 */
export async function GET(req) {
  // const {botId} = await req.json()
  const {searchParams} = new URL(req.url)
  const cbkbotId = searchParams.get('cbkbotId')
  const domainBotId = searchParams.get('domainBotId')
  if (!domainBotId || !cbkbotId) {
    console.log('invalid arguments')
    return Response.json(JSON.stringify({status: 400, error: 'Invalid arguments'}))
  }

  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 5000)
    })
    return Response.json({conversationId: 'convo', token: uuidv4()})
  } catch (error) {
    console.error(error)
    return Response.json(JSON.stringify({status: 400, error}))
  }
}