/**
 * Creates a conversation ID and conversation Session
 */
export async function GET(req) {
  // const {botId} = await req.json()
  const { searchParams } = new URL(req.url);
  const botId = searchParams.get('botId');
  await new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 3000);
  });
  return Response.json({
    conversationId: 'test-convo-id',
    token: 'test-token',
  });
}
