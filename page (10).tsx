import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { LISTINGS } from '@/lib/inventory'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Deposit = 10% of first month, bounded between $5k and $100k
const DEPOSIT_PCT  = 0.10
const MIN_DEPOSIT  = 5_000
const MAX_DEPOSIT  = 100_000
const HOURS_PER_MO = 24 * 30

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const meta = user.publicMetadata as {
      onboarded?: boolean
      companyName?: string
      legalName?: string
    }
    if (!meta?.onboarded) {
      return NextResponse.json({ error: 'Profile incomplete' }, { status: 403 })
    }

    const { listingId, units, refId } = await req.json()

    const listing = LISTINGS.find(l => l.id === listingId)
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

    const numUnits   = parseInt((units || '').replace(/,/g, ''), 10) || 1
    const firstMonth = numUnits * listing.price * HOURS_PER_MO
    const depositRaw = firstMonth * DEPOSIT_PCT
    const depositAmt = Math.max(MIN_DEPOSIT, Math.min(MAX_DEPOSIT, depositRaw))
    const depositCents = Math.round(depositAmt * 100)

    const label = listing.status === 'LIVE' ? 'Reservation Deposit' : 'Pre-order Deposit'
    const desc  = `${numUnits.toLocaleString()} ${listing.unit}s · ${listing.chip} @ ${listing.site} · Ref: ${refId}`

    const origin = req.headers.get('origin') || 'https://compute.onevibemg.com'
    const email  = user.emailAddresses[0]?.emailAddress

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['us_bank_account'],
      payment_method_options: {
        us_bank_account: {
          financial_connections: {
            permissions: ['payment_method'],
          },
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: label,
              description: desc,
            },
            unit_amount: depositCents,
          },
          quantity: 1,
        },
      ],
      ...(email ? { customer_email: email } : {}),
      metadata: {
        refId:       refId || '',
        listingId,
        userId,
        units:       String(numUnits),
        companyName: meta.companyName || '',
      },
      success_url: `${origin}/payment/success?ref=${encodeURIComponent(refId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/?cancelled=1`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('create-checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
