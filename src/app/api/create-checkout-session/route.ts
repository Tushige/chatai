import { createCheckoutSession } from "@/actions/stripe"
import { redirect } from "next/navigation"

export async function POST(req, res) {
  try {
    console.log('[CREATE-STRIPE SESSION] API ROUTE]')
    const {priceId, customerId} = await req.json()
    const session = await createCheckoutSession(priceId, customerId)
    return new Response(JSON.stringify({
      url: session.url
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({error: err}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}