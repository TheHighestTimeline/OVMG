import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { updateReservationStatus } from '@/lib/airtable'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Next.js App Router: disable automatic body parsing so we can get the raw bytes
// for Stripe signature verification
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Only process if payment is fully collected (ACH can have delayed confirmation)
    if (session.payment_status === 'paid') {
      const { refId } = session.metadata || {}
      if (refId) {
        try {
          await updateReservationStatus(refId, 'deposit_received', {
            'Payment Method': 'ACH (Stripe)',
          })
          console.log(`[webhook] Deposit received for ${refId}`)
        } catch (err) {
          console.error('[webhook] Airtable update failed:', err)
          // Return 200 so Stripe doesn't retry — log and investigate separately
        }
      }
    }
  }

  // ACH payments often move through 'payment_intent.processing' before settling
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const refId = pi.metadata?.refId
    if (refId) {
      try {
        await updateReservationStatus(refId, 'deposit_received', {
          'Payment Method': 'ACH (Stripe)',
        })
        console.log(`[webhook] Payment intent succeeded for ${refId}`)
      } catch (err) {
        console.error('[webhook] Airtable update on payment_intent.succeeded failed:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
