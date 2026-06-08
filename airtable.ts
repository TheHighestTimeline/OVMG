import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// EIN format: XX-XXXXXXX (9 digits)
function isValidEINFormat(ein: string): boolean {
  const digits = ein.replace(/\D/g, '')
  if (digits.length !== 9) return false
  // EINs cannot start with 00, 07, 08, 09, 17, 18, 19, 28, 29, 49, 69, 70, 78, 79, 89
  const prefix = parseInt(digits.slice(0, 2))
  const invalidPrefixes = [0, 7, 8, 9, 17, 18, 19, 28, 29, 49, 69, 70, 78, 79, 89]
  if (invalidPrefixes.includes(prefix)) return false
  return true
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ein, companyName } = await req.json()
  const digits = (ein || '').replace(/\D/g, '')

  // Step 1: Format validation
  if (!isValidEINFormat(digits)) {
    return NextResponse.json({
      valid: false,
      message: 'Invalid EIN format. EINs are 9 digits in XX-XXXXXXX format.',
    })
  }

  // Step 2: Middesk verification (if API key is configured)
  const MIDDESK_KEY = process.env.MIDDESK_API_KEY
  if (MIDDESK_KEY) {
    try {
      const res = await fetch('https://api.middesk.com/v1/businesses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MIDDESK_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: companyName,
          tin: { ein: digits },
        }),
      })
      const data = await res.json()

      if (res.ok && data.status === 'verified') {
        return NextResponse.json({
          valid: true,
          message: `EIN verified — ${data.name || companyName} confirmed with IRS records.`,
          verified: true,
        })
      } else if (data.status === 'failed') {
        return NextResponse.json({
          valid: false,
          message: 'EIN does not match IRS records for this company name. Please double-check both fields.',
        })
      }
      // Middesk returned pending — fall through to format-only pass
    } catch (err) {
      console.error('Middesk error:', err)
      // Fall through to format-only validation
    }
  }

  // Step 3: Format-only pass (Middesk not configured or returned pending)
  // EIN passes format check — will be flagged for manual review on large reservations
  return NextResponse.json({
    valid: true,
    message: companyName
      ? `EIN format valid for ${companyName}. Business identity will be confirmed during LOI review.`
      : 'EIN format valid. Business identity will be confirmed during LOI review.',
    verified: false, // format-only, not IRS-confirmed
  })
}
