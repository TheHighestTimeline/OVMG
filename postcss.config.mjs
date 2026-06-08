'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const params = useSearchParams()
  const ref    = params.get('ref') || '—'

  return (
    <div className="auth-shell" style={{ maxWidth: 560 }}>
      <div className="auth-brand">
        <span className="brand-mark">OneVibe</span>
        <span className="brand-sep">/</span>
        <span className="brand-product">Payment Confirmed</span>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border:     '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding:    '40px 36px',
        width:      '100%',
        textAlign:  'center',
      }}>
        {/* Check icon */}
        <div style={{
          width:        56,
          height:       56,
          borderRadius: '50%',
          background:   'var(--live-soft)',
          border:       '1px solid var(--live-edge)',
          display:      'inline-flex',
          alignItems:   'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="var(--live)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Deposit received
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Your ACH deposit has been submitted. Bank transfers typically settle
          within 1–3 business days — we'll email you confirmation once cleared.
        </p>

        <div style={{
          background:   'var(--bg-input)',
          border:       '1px solid var(--border)',
          borderRadius: 8,
          padding:      '12px 16px',
          marginBottom: 28,
          textAlign:    'left',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Reference
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>
            {ref}
          </div>
        </div>

        <div style={{
          background:   'var(--bg-input)',
          border:       '1px solid var(--border)',
          borderRadius: 8,
          padding:      '14px 16px',
          marginBottom: 28,
          textAlign:    'left',
          fontSize:     13,
          color:        'var(--text-3)',
          lineHeight:   1.7,
        }}>
          <strong style={{ color: 'var(--text-2)' }}>What happens next</strong><br />
          1. Your deposit clears (1–3 business days)<br />
          2. A OneVibe rep contacts you within 1 business day to countersign the LOI<br />
          3. Definitive compute agreement is drafted and executed<br />
          4. Capacity is formally allocated to your account
        </div>

        <a
          href="/"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            6,
            padding:        '11px 20px',
            background:     'var(--bg-elev)',
            border:         '1px solid var(--border-strong)',
            borderRadius:   8,
            color:          'var(--text-2)',
            fontSize:       13,
            textDecoration: 'none',
          }}
        >
          ← Back to marketplace
        </a>

        <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-4)' }}>
          Questions? Email{' '}
          <a href="mailto:compute@onevibemg.com" style={{ color: 'var(--text-3)' }}>
            compute@onevibemg.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="auth-shell" />}>
      <SuccessContent />
    </Suspense>
  )
}
