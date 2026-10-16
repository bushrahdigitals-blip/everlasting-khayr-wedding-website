export const dynamic = 'force-dynamic'

type VoteKind = 'attendance' | 'review' | 'review-entry' | 'guest-message'
type VoteChoice = 'attending' | 'not-attending' | 'stunning' | 'fair'
const REVIEW_PAGE_SIZE = 50
const MESSAGE_PAGE_SIZE = 50

function configuration() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return { url: url.replace(/\/+$/, ''), key }
}

async function databaseRequest(path: string, init?: RequestInit) {
  const config = configuration()
  if (!config) throw new Error('Shared RSVP and review storage is not configured.')
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) throw new Error(`Shared feedback database request failed with status ${response.status}.`)
  return response
}

async function readCounts(table: string) {
  const choices = table === 'attendance_responses'
    ? ['attending', 'not-attending'] as const
    : ['stunning', 'fair'] as const
  const entries = await Promise.all(choices.map(async (choice) => {
    const response = await databaseRequest(`${table}?select=voter_id&choice=eq.${encodeURIComponent(choice)}`, {
      method: 'HEAD',
      headers: { Prefer: 'count=exact' },
    })
    const total = Number(response.headers.get('content-range')?.split('/')[1])
    if (!Number.isSafeInteger(total)) throw new Error('The database did not return an exact response count.')
    return [choice, total] as const
  }))
  return Object.fromEntries(entries) as Record<(typeof choices)[number], number>
}

async function readWrittenReviews(offset: number) {
  const query = new URLSearchParams({
    select: 'name,message,submitted_at',
    order: 'submitted_at.desc,voter_id.asc',
    limit: String(REVIEW_PAGE_SIZE),
    offset: String(offset),
  })
  const response = await databaseRequest(`visitor_reviews?${query}`)
  return response.json() as Promise<{ name: string; message: string; submitted_at: string }[]>
}

async function countWrittenReviews() {
  const response = await databaseRequest('visitor_reviews?select=voter_id', {
    method: 'HEAD', headers: { Prefer: 'count=exact' },
  })
  const total = Number(response.headers.get('content-range')?.split('/')[1])
  if (!Number.isSafeInteger(total)) throw new Error('The database did not return an exact review count.')
  return total
}

async function readGuestMessages(offset: number) {
  const query = new URLSearchParams({
    select: 'message_id,name,relationship,message,submitted_at',
    order: 'submitted_at.desc,message_id.asc',
    limit: String(MESSAGE_PAGE_SIZE),
    offset: String(offset),
  })
  const response = await databaseRequest(`guest_messages?${query}`)
  return response.json() as Promise<{ message_id: string; name: string; relationship: string | null; message: string; submitted_at: string }[]>
}

async function countGuestMessages() {
  const response = await databaseRequest('guest_messages?select=message_id', {
    method: 'HEAD', headers: { Prefer: 'count=exact' },
  })
  const total = Number(response.headers.get('content-range')?.split('/')[1])
  if (!Number.isSafeInteger(total)) throw new Error('The database did not return an exact message count.')
  return total
}

export async function GET(request: Request) {
  try {
    const rawOffset = new URL(request.url).searchParams.get('offset') ?? '0'
    const offset = Number(rawOffset)
    const rawMessageOffset = new URL(request.url).searchParams.get('messageOffset') ?? '0'
    const messageOffset = Number(rawMessageOffset)
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(messageOffset) || messageOffset < 0) {
      return Response.json({ error: 'Offsets must be non-negative whole numbers.' }, { status: 400 })
    }
    const summaryOnly = new URL(request.url).searchParams.get('summary') === '1'
    const [attendance, reviews, guestMessageCount] = await Promise.all([
      readCounts('attendance_responses'),
      readCounts('website_reviews'),
      countGuestMessages(),
    ])
    if (summaryOnly) return Response.json({ attendance, reviews, guestMessageCount })
    const writtenReviewCount = await countWrittenReviews()
    const [writtenReviews, guestMessages] = await Promise.all([
      readWrittenReviews(offset),
      readGuestMessages(messageOffset),
    ])
    return Response.json({
      attendance,
      reviews,
      writtenReviews,
      writtenReviewCount,
      reviewOffset: offset,
      reviewsHasMore: offset + writtenReviews.length < writtenReviewCount,
      guestMessages,
      guestMessageCount,
      guestMessagesHasMore: messageOffset + guestMessages.length < guestMessageCount,
    })
  } catch (error) {
    console.error('[wedding-feedback] GET failed', error)
    return Response.json({ error: 'Shared responses are temporarily unavailable.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { kind?: VoteKind; voterId?: string; choice?: VoteChoice; name?: string; relationship?: string; message?: string; messageId?: string }
    if (body.kind === 'guest-message') {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const relationship = typeof body.relationship === 'string' ? body.relationship.trim() : ''
      const message = typeof body.message === 'string' ? body.message.trim() : ''
      if (!body.messageId || !/^[0-9a-f-]{36}$/i.test(body.messageId) || !name || name.length > 80 || relationship.length > 80 || !message || message.length > 1000) {
        return Response.json({ error: 'Enter your name and a message of up to 1,000 characters.' }, { status: 400 })
      }
      await databaseRequest('guest_messages?on_conflict=message_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ message_id: body.messageId, name, relationship: relationship || null, message, submitted_at: new Date().toISOString() }),
      })
      const [guestMessages, guestMessageCount] = await Promise.all([readGuestMessages(0), countGuestMessages()])
      return Response.json({ guestMessages, guestMessageCount, guestMessagesHasMore: guestMessages.length < guestMessageCount })
    }
    if (body.kind === 'review-entry') {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const message = typeof body.message === 'string' ? body.message.trim() : ''
      if (!body.voterId || !/^[0-9a-f-]{36}$/i.test(body.voterId) || !name || name.length > 80 || !message || message.length > 1000) {
        return Response.json({ error: 'Enter a name and a review of up to 1,000 characters.' }, { status: 400 })
      }
      await databaseRequest('visitor_reviews?on_conflict=voter_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ voter_id: body.voterId, name, message, submitted_at: new Date().toISOString() }),
      })
      const [writtenReviews, writtenReviewCount] = await Promise.all([readWrittenReviews(0), countWrittenReviews()])
      return Response.json({ writtenReviews, writtenReviewCount, reviewOffset: 0, reviewsHasMore: writtenReviews.length < writtenReviewCount })
    }
    const valid = body.kind === 'attendance'
      ? body.choice === 'attending' || body.choice === 'not-attending'
      : body.kind === 'review' && (body.choice === 'stunning' || body.choice === 'fair')
    if (!valid || !body.voterId || !/^[0-9a-f-]{36}$/i.test(body.voterId)) {
      return Response.json({ error: 'A valid response is required.' }, { status: 400 })
    }
    const table = body.kind === 'attendance' ? 'attendance_responses' : 'website_reviews'
    await databaseRequest(`${table}?on_conflict=voter_id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ voter_id: body.voterId, choice: body.choice }),
    })
    const [attendance, reviews] = await Promise.all([
      readCounts('attendance_responses'),
      readCounts('website_reviews'),
    ])
    return Response.json({ attendance, reviews })
  } catch (error) {
    console.error('[wedding-feedback] POST failed', error)
    return Response.json({ error: 'Shared responses are temporarily unavailable.' }, { status: 503 })
  }
}
