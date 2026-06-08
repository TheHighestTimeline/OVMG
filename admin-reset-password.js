/**
 * Airtable integration for reservation tracking.
 *
 * Required env vars:
 *   AIRTABLE_API_KEY   — your personal access token (starts with pat...)
 *   AIRTABLE_BASE_ID   — appmpQPSgdbJJH43H
 *
 * Table name: "Reservations"
 * Fields (create these in Airtable):
 *   Ref ID            (Single line text)
 *   Listing ID        (Single line text)
 *   Chip              (Single line text)
 *   Site              (Single line text)
 *   Facility Power    (Single line text)
 *   User ID           (Single line text)
 *   Buyer Name        (Single line text)
 *   Buyer Title       (Single line text)
 *   Buyer Company     (Single line text)
 *   Buyer Email       (Email)
 *   Buyer Address     (Single line text)
 *   Units             (Number)
 *   Price Per Unit    (Currency)
 *   Unit Type         (Single line text)
 *   Intended Use      (Single line text)
 *   Payment Method    (Single line text)
 *   Notes             (Long text)
 *   Status            (Single select: pending_review / loi_sent / loi_countersigned / finalized / cancelled)
 *   Large Reservation (Checkbox)
 *   LOI Text          (Long text)
 *   Created At        (Date — auto-set)
 */

export type ReservationStatus =
  | 'pending_review'
  | 'loi_sent'
  | 'loi_countersigned'
  | 'deposit_received'
  | 'finalized'
  | 'cancelled'

export interface ReservationRecord {
  refId: string
  listingId: string
  chip: string
  site: string
  facilityPower: string
  userId: string
  buyerName: string
  buyerTitle: string
  buyerCompany: string
  buyerEmail: string
  buyerAddress: string
  units: number
  pricePerUnit: number
  unitType: string
  intendedUse: string
  paymentMethod: string
  notes: string
  status: 'pending_review' | 'loi_sent' | 'loi_countersigned' | 'finalized' | 'cancelled'
  largeReservation: boolean
  loiText: string
}

function getBase() {
  const key  = process.env.AIRTABLE_API_KEY
  const base = process.env.AIRTABLE_BASE_ID

  if (!key || !base) {
    console.warn('Airtable not configured — AIRTABLE_API_KEY or AIRTABLE_BASE_ID missing.')
    return null
  }

  // Dynamic import to avoid bundling Airtable on the client
  const Airtable = require('airtable')
  Airtable.configure({ apiKey: key })
  return Airtable.base(base)
}

export async function createReservation(rec: ReservationRecord): Promise<void> {
  const base = getBase()
  if (!base) return // gracefully no-op if Airtable not configured

  await base('tbloezX8fuLCeDiYZ').create([{
    fields: {
      'Ref ID':            rec.refId,
      'Listing ID':        rec.listingId,
      'Chip':              rec.chip,
      'Site':              rec.site,
      'Facility Power':    rec.facilityPower,
      'User ID':           rec.userId,
      'Buyer Name':        rec.buyerName,
      'Buyer Title':       rec.buyerTitle,
      'Buyer Company':     rec.buyerCompany,
      'Buyer Email':       rec.buyerEmail,
      'Buyer Address':     rec.buyerAddress,
      'Units':             rec.units,
      'Price Per Unit':    rec.pricePerUnit,
      'Unit Type':         rec.unitType,
      'Intended Use':      rec.intendedUse,
      'Payment Method':    rec.paymentMethod,
      'Notes':             rec.notes,
      'Status':            rec.status,
      'Large Reservation': rec.largeReservation,
      'LOI Text':          rec.loiText,
    },
  }])
}

/**
 * Returns the number of units currently reserved (status: loi_sent, loi_countersigned, finalized)
 * for a given listing. Used to show live availability on the marketplace.
 */
export async function getReservedUnits(listingId: string): Promise<number> {
  const base = getBase()
  if (!base) return 0

  const activeStatuses = ['loi_sent', 'loi_countersigned', 'finalized']

  return new Promise((resolve, reject) => {
    let total = 0
    base('tbloezX8fuLCeDiYZ')
      .select({
        filterByFormula: `AND({Listing ID} = '${listingId}', OR(${
          activeStatuses.map(s => `{Status} = '${s}'`).join(', ')
        }))`,
        fields: ['Units'],
      })
      .eachPage(
        (records: any[], fetchNextPage: () => void) => {
          records.forEach(r => { total += (r.get('Units') as number) || 0 })
          fetchNextPage()
        },
        (err: Error | null) => {
          if (err) { console.error('Airtable getReservedUnits error:', err); resolve(0) }
          else resolve(total)
        }
      )
  })
}

/**
 * Returns reserved unit counts for all listings in one batch.
 * Key: listingId, Value: units reserved
 */
export async function getAllReservedUnits(): Promise<Record<string, number>> {
  const base = getBase()
  if (!base) return {}

  const activeStatuses = ['loi_sent', 'loi_countersigned', 'finalized']

  return new Promise((resolve, reject) => {
    const totals: Record<string, number> = {}
    base('tbloezX8fuLCeDiYZ')
      .select({
        filterByFormula: `OR(${activeStatuses.map(s => `{Status} = '${s}'`).join(', ')})`,
        fields: ['Listing ID', 'Units'],
      })
      .eachPage(
        (records: any[], fetchNextPage: () => void) => {
          records.forEach(r => {
            const id    = r.get('Listing ID') as string
            const units = (r.get('Units') as number) || 0
            totals[id]  = (totals[id] || 0) + units
          })
          fetchNextPage()
        },
        (err: Error | null) => {
          if (err) { console.error('Airtable getAllReservedUnits error:', err); resolve({}) }
          else resolve(totals)
        }
      )
  })
}

/**
 * Finds a reservation by refId and updates its status.
 * Used by the Stripe webhook on payment completion.
 */
export async function updateReservationStatus(
  refId: string,
  status: ReservationStatus,
  extraFields?: Record<string, unknown>,
): Promise<void> {
  const base = getBase()
  if (!base) return

  return new Promise((resolve, reject) => {
    base('tbloezX8fuLCeDiYZ')
      .select({
        filterByFormula: `{Ref ID} = '${refId}'`,
        maxRecords: 1,
        fields: ['Ref ID'],
      })
      .firstPage((err: Error | null, records: any[]) => {
        if (err || !records?.length) {
          console.error('updateReservationStatus: record not found for', refId, err)
          resolve()
          return
        }
        const recordId = records[0].id
        base('tbloezX8fuLCeDiYZ').update(
          recordId,
          { Status: status, ...(extraFields || {}) },
          (updateErr: Error | null) => {
            if (updateErr) console.error('updateReservationStatus update error:', updateErr)
            resolve()
          },
        )
      })
  })
}
