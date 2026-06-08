import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { LISTINGS } from '@/lib/inventory'
import { createReservation, getReservedUnits } from '@/lib/airtable'

const LARGE_RESERVATION_THRESHOLD = 500

function generateLOIText(params: {
  date: string
  buyerCompany: string
  buyerState: string
  buyerAddress: string
  buyerSignatory: string
  buyerTitle: string
  buyerEmail: string
  intendedUse: string
  chip: string
  site: string
  siteCode: string
  power: string
  powerLabel: string
  unitType: string
  unitLabel: string
  qty: number
  price: number
  paymentMethod: string
  notes: string
  refId: string
}): string {
  const {
    date, buyerCompany, buyerState, buyerAddress, buyerSignatory, buyerTitle, buyerEmail,
    intendedUse, chip, site, siteCode, power, powerLabel, unitType, unitLabel,
    qty, price, paymentMethod, notes, refId,
  } = params

  const hoursPerMo = 24 * 30
  const hoursPerYr = 24 * 365
  const monthlyEst = (qty * price * hoursPerMo).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const annualEst  = (qty * price * hoursPerYr).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const totalPerUnit = (price * hoursPerYr).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

  return `
NON-BINDING LETTER OF INTENT TO PURCHASE COMPUTE HOURS
Reference: ${refId}
================================================

This Non-Binding Letter of Intent ("LOI") is made and entered into as of ${date}, by and between:

${buyerCompany}, a State of ${buyerState} corporation, with its principal place of business
at ${buyerAddress} (hereinafter referred to as "Buyer"), and OneVibe Management Group, LLC.

Seller's Name: OneVibe Management Group, LLC, a State of Florida corporation, with its
principal place of business at 1001 Mayport Rd #330832, Atlantic Beach, FL 32233
(hereinafter referred to as "Seller").


1. PURPOSE
The purpose of this LOI is to outline the preliminary intent of Buyer to purchase compute
hours from Seller for the purpose of ${intendedUse || 'AI compute workloads'}. This LOI is
non-binding and subject to the execution of a definitive agreement between the parties.


2. INTENDED PURCHASE TERMS
• Buyer expresses interest in purchasing compute hours as per the specifications outlined
  in Exhibit A.
• The estimated quantity of ${unitLabel} to be purchased under this LOI is ${qty.toLocaleString()} ${unitLabel}.
• The anticipated price per ${unitType}-hour is $${price.toFixed(2)}, subject to negotiation.
• Estimated monthly value: ${monthlyEst}
• Estimated annual value:  ${annualEst}
• The estimated total contract value is subject to final agreement on contract term.


3. PAYMENT TERMS (SUBJECT TO FINAL AGREEMENT)
• Buyer anticipates making payment via ${paymentMethod || 'wire transfer'} within 30 days
  of receiving an invoice.
• Payment terms shall be finalized in a definitive agreement.


4. SERVICE LEVEL EXPECTATIONS
• Seller intends to provide compute uptime of at least 99.5%.
• Any terms regarding downtime compensation shall be detailed in a future agreement.


5. DELIVERY AND ACCESS
• Compute hours shall be accessible via dedicated network connection or VPN.
• Buyer shall be provided with necessary credentials and support to utilize the compute
  resources efficiently.


6. TERM AND TERMINATION
• This LOI shall remain in effect for a period of 90 days or until superseded by a
  definitive agreement.
• Either party may withdraw from this LOI at any time with written notice.


7. CONFIDENTIALITY
• Both parties agree to keep all proprietary and sensitive business information confidential.


8. GOVERNING LAW
• This LOI shall be governed by the laws of the State of Florida.


9. NON-BINDING NATURE
• This LOI is for discussion purposes only and does not create any legally binding
  obligations between the parties, except for confidentiality provisions.
• Any binding agreement shall be subject to the execution of a definitive written contract.


10. SIGNATURES
IN WITNESS WHEREOF, the parties hereto acknowledge their intent as outlined in this LOI
as of the date first written above.

BUYER:
${buyerCompany}

By (Electronic Signature): ${buyerSignatory}
Name: ${buyerSignatory} (Authorized Representative)
Title: ${buyerTitle}
Date: ${date}
Email: ${buyerEmail}

[Signed electronically via OneVibe Compute Marketplace under the Electronic Signatures
in Global and National Commerce Act (E-SIGN Act), 15 U.S.C. § 7001 et seq.]


SELLER:
OneVibe Management Group, LLC

By: ___________________________
Name: ___________________________ (Authorized Representative)
Title: ___________________________
Date: ___________________________


================================================
EXHIBIT A — Compute Hours Specifications

Chip / Hardware:  ${chip}
Site:             ${site} (${siteCode})
Facility power:   ${power} (${powerLabel})
Unit type:        ${unitType}
Quantity:         ${qty.toLocaleString()} ${unitLabel}
Listed rate:      $${price.toFixed(2)} / ${unitType}-hr
Rate per ${unitType}/yr:  ${totalPerUnit}

${notes ? `Additional notes from Buyer:\n${notes}` : ''}
================================================
`
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const meta = user.publicMetadata as {
      onboarded?: boolean
      legalName?: string
      title?: string
      companyName?: string
      companyState?: string
      companyAddress?: string
      companyCity?: string
      companyZip?: string
    }

    if (!meta?.onboarded) {
      return NextResponse.json({ error: 'Company profile incomplete' }, { status: 403 })
    }

    const { listingId, units, notes, paymentMethod, intendedUse } = await req.json()

    const listing = LISTINGS.find(l => l.id === listingId)
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

    const numUnits = parseInt((units || '').replace(/,/g, ''), 10) || 1
    const isLargeReservation = numUnits > LARGE_RESERVATION_THRESHOLD
    const refId = `LOI-${Date.now().toString().slice(-6)}`
    const email = user.emailAddresses[0]?.emailAddress || ''
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const buyerAddress = [
      meta.companyAddress,
      meta.companyCity,
      meta.companyState,
      meta.companyZip,
    ].filter(Boolean).join(', ')

    const loiText = generateLOIText({
      date,
      buyerCompany: meta.companyName || '',
      buyerState: meta.companyState || '',
      buyerAddress: buyerAddress,
      buyerSignatory: meta.legalName || '',
      buyerTitle: meta.title || '',
      buyerEmail: email,
      intendedUse: intendedUse || '',
      chip: listing.chip,
      site: listing.site,
      siteCode: listing.siteCode,
      power: listing.power,
      powerLabel: listing.powerLabel,
      unitType: listing.unit,
      unitLabel: listing.qtyLabel,
      qty: numUnits,
      price: listing.price,
      paymentMethod: paymentMethod || 'wire transfer',
      notes: notes || '',
      refId,
    })

    // ── Airtable reservation record ────────────────────────────────────
    const status = isLargeReservation ? 'pending_review' : 'loi_sent'
    await createReservation({
      refId,
      listingId: listing.id,
      chip: listing.chip,
      site: listing.site,
      facilityPower: listing.power,
      userId,
      buyerName: meta.legalName || '',
      buyerTitle: meta.title || '',
      buyerCompany: meta.companyName || '',
      buyerEmail: email,
      buyerAddress: buyerAddress,
      units: numUnits,
      pricePerUnit: listing.price,
      unitType: listing.unit,
      intendedUse: intendedUse || '',
      paymentMethod: paymentMethod || 'wire transfer',
      notes: notes || '',
      status,
      loiText,
      largeReservation: isLargeReservation,
    })

    // ── Email via Resend ───────────────────────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(RESEND_API_KEY)

      const subject = isLargeReservation
        ? `[REVIEW REQUIRED] Large reservation — ${listing.chip} @ ${listing.site} — ${meta.companyName} (${numUnits.toLocaleString()} ${listing.unit}s)`
        : `[LOI] ${listing.status === 'LIVE' ? 'Reservation' : 'Pre-order'} — ${listing.chip} @ ${listing.site} — ${meta.companyName}`

      // Internal notification to OVMG
      await resend.emails.send({
        from: 'OneVibe Compute <noreply@onevibemg.com>',
        to: ['compute@onevibemg.com'],
        subject,
        text: isLargeReservation
          ? `LARGE RESERVATION — MANUAL REVIEW REQUIRED\n\nBuyer: ${meta.legalName} (${meta.companyName})\nUnits: ${numUnits.toLocaleString()} ${listing.unit}s\nRef: ${refId}\n\n${loiText}`
          : loiText,
      })

      // Buyer confirmation
      await resend.emails.send({
        from: 'OneVibe Compute <compute@onevibemg.com>',
        to: [email],
        subject: `Your LOI — ${listing.chip} @ ${listing.site} (Ref: ${refId})`,
        text: isLargeReservation
          ? `Dear ${meta.legalName},\n\nThank you for your reservation. Your LOI is pending a brief manual review and will be finalized within one business day.\n\n${loiText}`
          : `Dear ${meta.legalName},\n\nThank you. Your Letter of Intent has been received. A OneVibe representative will contact you within one business day.\n\n${loiText}`,
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('\n=== RESERVATION SUBMITTED ===\n', loiText)
    }

    return NextResponse.json({
      success: true,
      referenceId: refId,
      pendingReview: isLargeReservation,
    })

  } catch (err) {
    console.error('Reservation error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
