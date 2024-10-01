import { createCheckoutSession, createPortalSession } from "@/actions/stripe"
import { redirect } from "next/navigation"

export async function POST(req, res) {
  try {
    console.log('[CREATE-PORTAL SESSION] API ROUTE]')
    const {customerId} = await req.json()
    const session = await createPortalSession(customerId)
    console.log('this is the portal session')
    console.log(session)
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