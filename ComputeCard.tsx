import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const {
    legalName, title, companyName, companyState,
    companyAddress, companyCity, companyZip, ein,
  } = await req.json()

  if (!legalName || !title || !companyName || !companyState || !companyAddress) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Store in Clerk publicMetadata — available server-side on every request
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboarded: true,
      legalName,
      title,
      companyName,
      companyState,
      companyAddress,
      companyCity: companyCity || '',
      companyZip: companyZip || '',
      // Store EIN masked — only last 4 digits in metadata, full EIN is never stored
      einLast4: ein ? ein.replace(/\D/g, '').slice(-4) : '',
      einVerified: true,
    },
  })

  return NextResponse.json({ success: true })
}
