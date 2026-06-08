# ── Clerk (auth) ──────────────────────────────────────────────────────────────
# Get these from https://dashboard.clerk.com → your app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Block personal email domains in Clerk dashboard (Settings → Restrictions):
# Block: gmail.com, yahoo.com, hotmail.com, outlook.com, icloud.com, aol.com

# ── Airtable (reservation tracking) ──────────────────────────────────────────
# Create a Personal Access Token at https://airtable.com/create/tokens
# Scopes needed: data.records:read, data.records:write
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX.XXXXXXXX
AIRTABLE_BASE_ID=appmpQPSgdbJJH43H

# ── Resend (email delivery) ───────────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# ── Middesk (optional — EIN business verification ~$2/check) ─────────────────
MIDDESK_API_KEY=
