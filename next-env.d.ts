'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  'District of Columbia',
]

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()

  const [form, setForm] = useState({
    legalName: '',
    title: '',
    companyName: '',
    companyState: '',
    companyAddress: '',
    companyCity: '',
    companyZip: '',
    ein: '',
  })
  const [einStatus, setEinStatus] = useState<'idle'|'checking'|'valid'|'invalid'>('idle')
  const [einMsg, setEinMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function verifyEIN() {
    const raw = form.ein.replace(/\D/g, '')
    if (raw.length !== 9) {
      setEinStatus('invalid')
      setEinMsg('EIN must be 9 digits (XX-XXXXXXX)')
      return
    }
    setEinStatus('checking')
    setEinMsg('')
    try {
      const res = await fetch('/api/verify-ein', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ein: raw, companyName: form.companyName }),
      })
      const data = await res.json()
      if (data.valid) {
        setEinStatus('valid')
        setEinMsg(data.message || 'EIN format confirmed.')
      } else {
        setEinStatus('invalid')
        setEinMsg(data.message || 'EIN could not be verified. Please check and try again.')
      }
    } catch {
      setEinStatus('invalid')
      setEinMsg('Verification service unavailable. Your EIN will be manually reviewed.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.legalName || !form.title || !form.companyName || !form.companyState || !form.companyAddress) {
      setError('Please fill in all required fields.')
      return
    }
    if (einStatus !== 'valid') {
      setError('Please verify your EIN before continuing.')
      return
    }
    setSaving(true)
    setError('')
    try {
      // Store profile in Clerk's publicMetadata via API
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      await user?.reload()
      router.push('/')
    } catch {
      setError('Failed to save profile. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="auth-shell" style={{ maxWidth: 680 }}>
      <div className="auth-brand">
        <span className="brand-mark">OneVibe</span>
        <span className="brand-sep">/</span>
        <span className="brand-product">Company Verification</span>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '36px',
        width: '100%',
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Set up your buyer profile
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Required before submitting a Letter of Intent. Your company details will appear
          on all LOI documents. Information is kept confidential per our standard NDA.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Personal info */}
          <div style={{ marginBottom: 24 }}>
            <div className="onb-section-label">Your information</div>
            <div className="form-row" style={{ marginBottom: 12 }}>
              <div className="field">
                <span>Legal full name <span style={{ color: 'var(--live)', fontSize: 11 }}>required</span></span>
                <input value={form.legalName} onChange={set('legalName')} placeholder="Jane Smith" required />
              </div>
              <div className="field">
                <span>Title at company <span style={{ color: 'var(--live)', fontSize: 11 }}>required</span></span>
                <input value={form.title} onChange={set('title')} placeholder="VP of Infrastructure" required />
              </div>
            </div>
          </div>

          {/* Company info */}
          <div style={{ marginBottom: 24 }}>
            <div className="onb-section-label">Company information</div>
            <div className="field" style={{ marginBottom: 12 }}>
              <span>Legal company name <span style={{ color: 'var(--live)', fontSize: 11 }}>required</span></span>
              <input value={form.companyName} onChange={set('companyName')} placeholder="Acme AI Corp, LLC" required />
            </div>
            <div className="form-row" style={{ marginBottom: 12 }}>
              <div className="field">
                <span>State of incorporation <span style={{ color: 'var(--live)', fontSize: 11 }}>required</span></span>
                <select
                  value={form.companyState}
                  onChange={set('companyState')}
                  required
                  style={{
                    width: '100%', padding: '11px 13px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: form.companyState ? 'var(--text)' : 'var(--text-4)',
                    fontFamily: 'inherit', fontSize: 14,
                    outline: 'none',
                  }}
                >
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <span>City</span>
                <input value={form.companyCity} onChange={set('companyCity')} placeholder="New York" />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <div className="field">
                <span>Registered business address <span style={{ color: 'var(--live)', fontSize: 11 }}>required</span></span>
                <input value={form.companyAddress} onChange={set('companyAddress')} placeholder="123 Commerce Dr, Suite 400" required />
              </div>
              <div className="field">
                <span>ZIP code</span>
                <input value={form.companyZip} onChange={set('companyZip')} placeholder="10001" maxLength={10} />
              </div>
            </div>
          </div>

          {/* EIN */}
          <div style={{ marginBottom: 28 }}>
            <div className="onb-section-label">Federal EIN verification</div>
            <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
              Your Employer Identification Number (EIN) is verified against your company name
              to confirm your business is registered with the IRS. Format: XX-XXXXXXX.
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: 1 }}>
                <span>EIN <span style={{ color: 'var(--live)', fontSize: 11 }}>required</span></span>
                <input
                  value={form.ein}
                  onChange={e => {
                    setEinStatus('idle')
                    // Auto-format as XX-XXXXXXX
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 9)
                    const formatted = raw.length > 2 ? raw.slice(0,2) + '-' + raw.slice(2) : raw
                    setForm(f => ({ ...f, ein: formatted }))
                  }}
                  placeholder="12-3456789"
                  maxLength={10}
                />
              </div>
              <button
                type="button"
                onClick={verifyEIN}
                disabled={einStatus === 'checking' || form.ein.length < 10}
                style={{
                  padding: '11px 18px',
                  background: einStatus === 'valid' ? 'var(--live-soft)' : 'var(--bg-elev)',
                  border: `1px solid ${einStatus === 'valid' ? 'var(--live-edge)' : einStatus === 'invalid' ? 'oklch(0.72 0.17 28 / 0.4)' : 'var(--border-strong)'}`,
                  borderRadius: 8,
                  color: einStatus === 'valid' ? 'var(--live)' : 'var(--text-2)',
                  fontSize: 13, fontFamily: 'inherit',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  marginBottom: 0, alignSelf: 'flex-end',
                }}
              >
                {einStatus === 'checking' ? 'Checking…' : einStatus === 'valid' ? '✓ Verified' : 'Verify EIN'}
              </button>
            </div>
            {einMsg && (
              <p style={{
                fontSize: 12.5, marginTop: 8, lineHeight: 1.5,
                color: einStatus === 'valid' ? 'var(--live)' : einStatus === 'invalid' ? 'oklch(0.72 0.17 28)' : 'var(--text-3)',
              }}>
                {einMsg}
              </p>
            )}
          </div>

          {error && (
            <p style={{ color: 'oklch(0.72 0.17 28)', fontSize: 13, marginBottom: 16 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={saving || einStatus !== 'valid'}
            className="cta cta-live"
            style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '13px 20px', opacity: (saving || einStatus !== 'valid') ? 0.5 : 1 }}
          >
            {saving ? 'Saving…' : 'Complete setup — go to marketplace →'}
          </button>

          <p style={{ color: 'var(--text-4)', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
            Your information is encrypted and only used to populate LOI documents.
          </p>
        </form>
      </div>
    </div>
  )
}
