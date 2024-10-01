import { getAuthId } from "@/actions/auth";
import { updateBilling } from "@/actions/billing.action";
import { stripeClient } from "@/actions/stripe";
import { getUserBilling } from "@/actions/user.action";

export async function POST(req, res) {
 const signature = req.headers.get('stripe-signature')
 const body = await req.text()
 let event;

 try {
  event = stripeClient.webhooks.constructEvent(
    body, signature, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error(`Webhook error: ${err}`)
    return new Response(`Webhook error: ${err}`, {status: 400})
  }
  let subscription;
  let status;
  switch (event.type) {
    case 'customer.subscription.updated':
      console.log('[webhook] subscription updated')
      break;
    case 'customer.subscription.created':
      break;
    case 'customer.subscription.deleted':
      console.log('[webhook] subscription deleted')
      break;
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
  return new Response(JSON.stringify({message: 'handled stripe event'}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}