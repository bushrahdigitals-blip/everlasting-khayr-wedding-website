'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  Flower2,
  Mail,
  Music2,
  Pause,
  Play,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Heart,
  MapPin,
  Menu,
  MessageCircleHeart,
  Phone,
  Send,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

const INVITATION_IMAGE =
  '/wedding-invitation-aqdu.jpg'
const ELEGANCE_IMAGE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Burgundy%20and%20Gold%20Wedding%20Invitation%20Elegance-6RABkq8k0tKcA2SAYg4JKaeUf1tNkC.png'
const FLORAL_GARLAND_IMAGE = '/floral-garland-transparent.png'
const WEDDING_AUDIO_SOURCE = '/audio/for-the-rest-of-my-life-normalized.mp3'
const EVENT_DATE = new Date('2026-12-20T10:00:00+01:00')
const VOTER_ID_STORAGE_KEY = 'everlasting-khayr-voter-id'
const VENUE_ADDRESS = 'Harmony Event Centre, 36 Abeokuta Street, by Tapa, Oyingbo, Ebute Metta, Lagos State, Nigeria'

type VoteCounts = { attendance: { attending: number; 'not-attending': number }; reviews: { stunning: number; fair: number } }
type WebsiteReview = { name: string; message: string; submitted_at: string }
type SharedWeddingWish = WeddingWish & { message_id: string; submitted_at: string }
function getVoterId() {
  let id = window.localStorage.getItem(VOTER_ID_STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    window.localStorage.setItem(VOTER_ID_STORAGE_KEY, id)
  }
  return id
}

type WeddingWish = {
  name: string
  message: string
  relationship?: string
}

const wishes: WeddingWish[] = [
  { name: 'Aunty Rukayat', message: 'May Allah make your home a garden of sakinah, mercy, and everlasting khayr. Aameen.' },
  { name: 'Mariam & family', message: 'May your companionship always bring you closer to Allah and to one another.' },
  { name: 'Abu Kareem', message: 'May this beautiful beginning be filled with barakah, laughter, and gentle understanding.' },
]

function Countdown() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const difference = now ? Math.max(0, EVENT_DATE.getTime() - now.getTime()) : 0
  const values = [
    ['Days', Math.floor(difference / 86400000)],
    ['Hours', Math.floor((difference / 3600000) % 24)],
    ['Minutes', Math.floor((difference / 60000) % 60)],
    ['Seconds', Math.floor((difference / 1000) % 60)],
  ]
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Countdown to the wedding">
      {values.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#c8a65d]/30 bg-[#3d0716]/60 px-2 py-3 text-center backdrop-blur-sm">
          <p className="font-serif text-2xl text-[#f6e9c9] sm:text-3xl">{String(value).padStart(2, '0')}</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#d7bd82]">{label}</p>
        </div>
      ))}
    </div>
  )
}

function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

function WeddingMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const [volume, setVolume] = useState(1)
  const lastVolumeRef = useRef(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    if (audio.error) setAudioError(true)
    if (audio.readyState >= 1) setDuration(audio.duration)
    if (audio.currentTime > 0) setCurrentTime(audio.currentTime)
  }, [volume])

  const toggleMute = () => {
    if (volume > 0) {
      lastVolumeRef.current = volume
      setVolume(0)
      return
    }
    setVolume(lastVolumeRef.current || 1)
  }

  const updateVolume = (nextVolume: number) => {
    if (nextVolume > 0) lastVolumeRef.current = nextVolume
    setVolume(nextVolume)
  }

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio || audioError) return
    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setAudioError(true)
      }
    } else {
      audio.pause()
    }
  }

  return (
    <section aria-label="Wedding music" className="bg-[#3d0716] px-5 pb-12 pt-4 text-[#f7f0df] sm:pb-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-[#c8a65d]/50 bg-[#5a0b1d] p-5 shadow-xl shadow-black/20 sm:flex sm:items-center sm:gap-6 sm:p-6">
        <div className="flex items-center gap-4 sm:min-w-64">
          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d7bd82] text-[#3d0716]"><Music2 aria-hidden="true" /></div>
          <div className="min-w-0">
            <h2 className="font-serif text-xl text-[#f6e9c9]">A Little Music for Your Special Moment</h2>
            <p className="mt-1 text-xs text-[#eadfcb]/75">Tap to listen and enjoy the celebration.</p>
          </div>
        </div>
        <div className="mt-5 min-w-0 flex-1 sm:mt-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={togglePlayback} disabled={audioError} aria-label={isPlaying ? 'Pause wedding music' : 'Play wedding music'} className="grid size-11 shrink-0 place-items-center rounded-full bg-[#d7bd82] text-[#3d0716] transition hover:bg-[#f2d991] disabled:cursor-not-allowed disabled:opacity-50">
              {isPlaying ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
            </button>
            <input aria-label="Seek wedding music" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} disabled={!duration || audioError} onChange={(event) => {
              const audio = audioRef.current
              if (audio) audio.currentTime = Number(event.currentTarget.value)
            }} className="h-1.5 min-w-0 flex-1 cursor-pointer accent-[#d7bd82] disabled:cursor-not-allowed" />
            <span className="min-w-20 text-right text-[11px] tabular-nums text-[#eadfcb]">{formatAudioTime(currentTime)} / {formatAudioTime(duration)}</span>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button type="button" onClick={toggleMute} disabled={audioError} aria-label={volume === 0 ? 'Unmute wedding music' : 'Mute wedding music'} title={volume === 0 ? 'Unmute' : 'Mute'} className="grid size-9 shrink-0 place-items-center rounded-full text-[#f2d991] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
              {volume === 0 ? <VolumeX aria-hidden="true" className="size-5" /> : <Volume2 aria-hidden="true" className="size-5" />}
            </button>
            <input aria-label="Wedding music volume" type="range" min="0" max="1" step="0.01" value={volume} disabled={audioError} onChange={(event) => updateVolume(Number(event.currentTarget.value))} className="h-1.5 w-28 cursor-pointer accent-[#d7bd82] disabled:cursor-not-allowed" />
            <span className="w-9 text-right text-[11px] tabular-nums text-[#eadfcb]">{Math.round(volume * 100)}%</span>
          </div>
          <p role="status" className="mt-2 min-h-4 text-[11px] text-[#eadfcb]/75">{audioError ? <>Audio file unavailable. Add the song at <code className="text-[#f2d991]">public/audio/for-the-rest-of-my-life-normalized.mp3</code>.</> : isPlaying ? 'Now playing' : 'Paused'}</p>
        </div>
        <audio ref={audioRef} src={WEDDING_AUDIO_SOURCE} preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} onError={() => setAudioError(true)} />
      </div>
    </section>
  )
}

export default function WeddingSite() {
  const [welcomeOpen, setWelcomeOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ameenCount, setAmeenCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wishRelationship, setWishRelationship] = useState('')
  const [wishText, setWishText] = useState('')
  const [wishSubmitting, setWishSubmitting] = useState(false)
  const [wishSubmitStatus, setWishSubmitStatus] = useState('')
  const [attendanceChoice, setAttendanceChoiceState] = useState<'attending' | 'not-attending' | null>(null)
  const [attendanceVotes, setAttendanceVotes] = useState({ attending: 0, notAttending: 0 })
  const [guestWishes, setGuestWishes] = useState<SharedWeddingWish[]>([])
  const [guestMessageCount, setGuestMessageCount] = useState(0)
  const [guestMessagesHasMore, setGuestMessagesHasMore] = useState(false)
  const [guestMessagesLoading, setGuestMessagesLoading] = useState(false)
  const [guestMessagesLoadError, setGuestMessagesLoadError] = useState('')
  const [showAllWishes, setShowAllWishes] = useState(false)
  const [activeGalleryImage, setActiveGalleryImage] = useState<{ src: string; alt: string } | null>(null)
  const [reviewVotes, setReviewVotes] = useState({ stunning: 0, fair: 0 })
  const [reviewChoice, setReviewChoice] = useState<'stunning' | 'fair' | null>(null)
  const [feedbackStatus, setFeedbackStatus] = useState('')
  const [savingVote, setSavingVote] = useState<'attendance' | 'review' | null>(null)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')
  const [writtenReviews, setWrittenReviews] = useState<WebsiteReview[]>([])
  const [writtenReviewCount, setWrittenReviewCount] = useState(0)
  const [reviewsHasMore, setReviewsHasMore] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsLoadError, setReviewsLoadError] = useState('')
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  const dateLabel = useMemo(() =>
    new Intl.DateTimeFormat('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' }).format(EVENT_DATE).replace(/\b20\b/, '20th'), [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setWelcomeOpen(false), reducedMotion ? 1800 : 4800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    try {
      const savedCount = Number(window.localStorage.getItem('everlasting-khayr-ameen-count'))
      if (Number.isSafeInteger(savedCount) && savedCount > 0) setAmeenCount(savedCount)
      const savedReviewChoice = window.localStorage.getItem('everlasting-khayr-review-choice')
      if (savedReviewChoice === 'stunning' || savedReviewChoice === 'fair') setReviewChoice(savedReviewChoice)
      const savedAttendanceChoice = window.localStorage.getItem('everlasting-khayr-attendance-choice')
      if (savedAttendanceChoice === 'attending' || savedAttendanceChoice === 'not-attending') setAttendanceChoiceState(savedAttendanceChoice)
    } catch {
      // The counter remains available for this visit if browser storage is disabled.
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadCounts = async () => {
      try {
        const response = await fetch('/api/wedding-feedback', { cache: 'no-store' })
        const data = await response.json() as VoteCounts & { writtenReviews: WebsiteReview[]; writtenReviewCount: number; reviewsHasMore: boolean; guestMessages: SharedWeddingWish[]; guestMessageCount: number; guestMessagesHasMore: boolean; error?: string }
        if (!response.ok) throw new Error(data.error || 'Shared feedback storage is unavailable.')
        if (cancelled) return
        setAttendanceVotes({ attending: data.attendance.attending, notAttending: data.attendance['not-attending'] })
        setReviewVotes(data.reviews)
        setWrittenReviews(data.writtenReviews)
        setWrittenReviewCount(data.writtenReviewCount)
        setReviewsHasMore(data.reviewsHasMore)
        setGuestWishes(data.guestMessages)
        setGuestMessageCount(data.guestMessageCount)
        setGuestMessagesHasMore(data.guestMessagesHasMore)
        setFeedbackStatus('')
      } catch (error) {
        if (!cancelled) setFeedbackStatus('Shared totals are currently unavailable.')
      }
    }
    void loadCounts()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const refreshSharedTotals = async () => {
      try {
        const response = await fetch('/api/wedding-feedback?summary=1', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json() as VoteCounts & { guestMessageCount: number }
        if (cancelled) return
        setAttendanceVotes({ attending: data.attendance.attending, notAttending: data.attendance['not-attending'] })
        setReviewVotes(data.reviews)
        setGuestMessageCount(data.guestMessageCount)
      } catch {
        // Keep the last confirmed shared totals visible while the connection is unavailable.
      }
    }
    const timer = window.setInterval(() => { void refreshSharedTotals() }, 5000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!activeGalleryImage) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveGalleryImage(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeGalleryImage])

  const recordAmeen = () => {
    setAmeenCount((count) => {
      const nextCount = count + 1
      try {
        window.localStorage.setItem('everlasting-khayr-ameen-count', String(nextCount))
      } catch {
        // The counter remains available for this visit if browser storage is disabled.
      }
      return nextCount
    })
  }

  const saveVote = async (kind: 'attendance' | 'review', choice: 'attending' | 'not-attending' | 'stunning' | 'fair') => {
    setSavingVote(kind)
    setFeedbackStatus('Saving your response…')
    try {
      const response = await fetch('/api/wedding-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, choice, voterId: getVoterId() }),
      })
      const data = await response.json() as VoteCounts & { error?: string }
      if (!response.ok) throw new Error(data.error || 'Your response could not be saved.')
      setAttendanceVotes({ attending: data.attendance.attending, notAttending: data.attendance['not-attending'] })
      setReviewVotes(data.reviews)
      setFeedbackStatus('Your response was saved.')
      if (kind === 'attendance') {
        setAttendanceChoiceState(choice as 'attending' | 'not-attending')
        try { window.localStorage.setItem('everlasting-khayr-attendance-choice', choice) } catch { /* Shared response is already saved. */ }
      } else {
        setReviewChoice(choice as 'stunning' | 'fair')
        try { window.localStorage.setItem('everlasting-khayr-review-choice', choice) } catch { /* Shared response is already saved. */ }
      }
    } catch (error) {
      setFeedbackStatus('Shared responses are temporarily unavailable.')
    } finally {
      setSavingVote(null)
    }
  }

  const castAttendanceVote = (choice: 'attending' | 'not-attending') => {
    setAttendanceChoiceState(choice)
    setFeedbackStatus('')
    void saveVote('attendance', choice)
  }

  const setAttendanceChoice = castAttendanceVote

  const castReviewVote = (choice: 'stunning' | 'fair') => {
    setReviewChoice(choice)
    setFeedbackStatus('')
    void saveVote('review', choice)
  }

  const submitWrittenReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!reviewName.trim() || !reviewMessage.trim()) {
      setReviewSubmitStatus('Please enter your name and review.')
      return
    }
    setReviewSubmitting(true)
    setReviewSubmitStatus('')
    try {
      const response = await fetch('/api/wedding-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'review-entry', voterId: getVoterId(), name: reviewName.trim(), message: reviewMessage.trim() }),
      })
      const data = await response.json() as { writtenReviews?: WebsiteReview[]; writtenReviewCount?: number; reviewsHasMore?: boolean; error?: string }
      if (!response.ok) throw new Error(data.error || 'Your review could not be saved.')
      setWrittenReviews(data.writtenReviews ?? [])
      setWrittenReviewCount(data.writtenReviewCount ?? data.writtenReviews?.length ?? 0)
      setReviewsHasMore(data.reviewsHasMore ?? false)
      setReviewName('')
      setReviewMessage('')
      setReviewFormOpen(false)
      setReviewSubmitStatus('Your review has been saved and is now visible.')
    } catch (error) {
      setReviewSubmitStatus('Reviews are temporarily unavailable.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const loadMoreReviews = async () => {
    if (reviewsLoading || !reviewsHasMore) return
    setReviewsLoading(true)
    setReviewsLoadError('')
    try {
      const response = await fetch(`/api/wedding-feedback?offset=${writtenReviews.length}`, { cache: 'no-store' })
      const data = await response.json() as { writtenReviews?: WebsiteReview[]; writtenReviewCount?: number; reviewsHasMore?: boolean; error?: string }
      if (!response.ok) throw new Error(data.error || 'Unable to load more reviews.')
      const existing = new Set(writtenReviews.map((review) => `${review.submitted_at}|${review.name}|${review.message}`))
      const nextPage = (data.writtenReviews ?? []).filter((review) => !existing.has(`${review.submitted_at}|${review.name}|${review.message}`))
      setWrittenReviews((current) => [...current, ...nextPage])
      setWrittenReviewCount(data.writtenReviewCount ?? writtenReviewCount)
      setReviewsHasMore(data.reviewsHasMore ?? false)
    } catch (error) {
      setReviewsLoadError('We couldn’t load more reviews right now. Please try again.')
    } finally {
      setReviewsLoading(false)
    }
  }

  const loadMoreGuestMessages = async () => {
    if (guestMessagesLoading || !guestMessagesHasMore) return
    setGuestMessagesLoading(true)
    setGuestMessagesLoadError('')
    try {
      const response = await fetch(`/api/wedding-feedback?messageOffset=${guestWishes.length}`, { cache: 'no-store' })
      const data = await response.json() as { guestMessages?: SharedWeddingWish[]; guestMessageCount?: number; guestMessagesHasMore?: boolean; error?: string }
      if (!response.ok) throw new Error(data.error || 'Unable to load more messages.')
      setGuestWishes((current) => {
        const existingIds = new Set(current.map((wish) => wish.message_id))
        return [...current, ...(data.guestMessages ?? []).filter((wish) => !existingIds.has(wish.message_id))]
      })
      setGuestMessageCount(data.guestMessageCount ?? guestMessageCount)
      setGuestMessagesHasMore(data.guestMessagesHasMore ?? false)
    } catch {
      setGuestMessagesLoadError('We couldn’t load more messages right now. Please try again.')
    } finally {
      setGuestMessagesLoading(false)
    }
  }

  const submitGuestWish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = wishName.trim()
    const relationship = wishRelationship.trim()
    const message = wishText.trim()
    if (!name || !message) {
      setWishSubmitStatus('Please enter your name and message.')
      return
    }
    setWishSubmitting(true)
    setWishSubmitStatus('')
    try {
      const response = await fetch('/api/wedding-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'guest-message', messageId: crypto.randomUUID(), name, relationship, message }),
      })
      const data = await response.json() as { guestMessages?: SharedWeddingWish[]; guestMessageCount?: number; guestMessagesHasMore?: boolean; error?: string }
      if (!response.ok) throw new Error(data.error || 'Your message could not be saved.')
      setGuestWishes(data.guestMessages ?? [])
      setGuestMessageCount(data.guestMessageCount ?? data.guestMessages?.length ?? 0)
      setGuestMessagesHasMore(data.guestMessagesHasMore ?? false)
      setWishName('')
      setWishRelationship('')
      setWishText('')
      setShowAllWishes(true)
      setWishSubmitStatus('Your message has been saved and is now visible to everyone.')
    } catch {
      setWishSubmitStatus('Guest messages are temporarily unavailable.')
    } finally {
      setWishSubmitting(false)
    }
  }

  const shareInvitation = async () => {
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '')
    const invitationUrl = configuredSiteUrl || window.location.origin
    const shareData = { title: 'Everlasting Khayr — Baqiyah & Hassan', text: 'Join us for the AQDU-NIKKAH & WALEEMATU NIKKAH of Baqiyah and Hassan.', url: invitationUrl }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(invitationUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.prompt('Copy the invitation link:', invitationUrl)
    }
  }

  const reviewVoteTotal = reviewVotes.stunning + reviewVotes.fair
  const attendanceVoteTotal = attendanceVotes.attending + attendanceVotes.notAttending
  const attendingPercent = attendanceVoteTotal ? Math.round((attendanceVotes.attending / attendanceVoteTotal) * 100) : 0
  const notAttendingPercent = attendanceVoteTotal ? 100 - attendingPercent : 0
  const stunningPercent = reviewVoteTotal ? Math.round((reviewVotes.stunning / reviewVoteTotal) * 100) : 0
  const fairPercent = reviewVoteTotal ? 100 - stunningPercent : 0
  const displayedWishes = [...guestWishes, ...wishes]
  const visibleWishes = showAllWishes ? displayedWishes : displayedWishes.slice(0, wishes.length)
  const reviewLeaderText = reviewVoteTotal === 0
    ? 'Be the first to review the website.'
    : reviewVotes.stunning === reviewVotes.fair
      ? 'Stunning and Fair are tied.'
      : `${reviewVotes.stunning > reviewVotes.fair ? 'Stunning' : 'Fair'} is leading.`
  const reviewLeader = <span>{reviewLeaderText}</span>

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f0df] text-[#3d0716] selection:bg-[#c8a65d]/30">
      {welcomeOpen && <div className="welcome-gift pointer-events-none fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-[#3d0716]/95 px-5 text-center text-[#f7f0df]" role="dialog" aria-modal="true" aria-label="Welcome to Everlasting Khayr">
        <div aria-hidden="true" className="welcome-sparkles pointer-events-none absolute inset-0">✦ <span>✧</span> ✨ <span>✦</span> ✧</div>
        <div className="pointer-events-none relative mx-auto max-w-xl rounded-[2rem] border border-[#c8a65d]/60 bg-[#5a0b1d]/90 p-8 shadow-2xl sm:p-12">
          <p className="text-3xl" aria-hidden="true">🎁</p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#d7bd82]">A celebration of love</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-[#f6e9c9] sm:text-5xl">You&apos;re warmly welcome to Everlasting Khayr! 🤍✨</h2>
          <p className="mt-4 font-serif text-xl text-[#d7bd82]">Baqiyah &amp; Hassan</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2d991]"><span className="block">#EverlastingKhayr&apos;26</span><span className="mt-1 block">Foladamilare</span></p>
          <button type="button" autoFocus onClick={() => setWelcomeOpen(false)} className="pointer-events-auto mt-7 rounded-full border border-[#d7bd82] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#f7f0df] transition hover:bg-[#d7bd82] hover:text-[#3d0716]">Open invitation</button>
        </div>
      </div>}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#3d0716]/90 px-5 py-4 text-[#f7f0df] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="#top" className="font-serif text-lg tracking-[0.18em] text-[#ead3a0]" aria-label="Everlasting Khayr 2026">EK&apos;26</a>
          <div className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.2em] md:flex">
            <a href="#invitation" className="transition-colors hover:text-[#d7bd82]">Invitation</a><a href="#gallery" className="transition-colors hover:text-[#d7bd82]">Gallery</a><a href="#messages" className="transition-colors hover:text-[#d7bd82]">Messages</a><a href="#rsvp" className="transition-colors hover:text-[#d7bd82]">RSVP</a><a href="#wishes" className="transition-colors hover:text-[#d7bd82]">Wishes</a><a href="#venue" className="transition-colors hover:text-[#d7bd82]">Venue</a>
          </div>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-4 text-center text-xs uppercase tracking-[0.2em] md:hidden"><a href="#invitation" onClick={() => setMenuOpen(false)}>Invitation</a><a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a><a href="#messages" onClick={() => setMenuOpen(false)}>Messages</a><a href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP</a><a href="#wishes" onClick={() => setMenuOpen(false)}>Wishes</a><a href="#venue" onClick={() => setMenuOpen(false)}>Venue</a></div>}
      </nav>

      <section id="top" className="relative flex min-h-[760px] items-center justify-center bg-[#3d0716] px-5 pb-20 pt-32 text-center text-[#f7f0df]">
        <div className="absolute inset-0 opacity-0 sm:opacity-25" style={{ backgroundImage: `url(${INVITATION_IMAGE})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#3d0716_78%)]" />
        <div className="welcome-content relative z-10 mx-auto max-w-3xl">
          <p className="font-serif text-3xl text-[#e4c984] sm:text-4xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.33em] text-[#d7bd82]">Bismillahir Rahmanir Raheem</p>
          <div className="mx-auto my-8 flex max-w-xs items-center gap-3 text-[#c8a65d]"><span className="h-px flex-1 bg-[#c8a65d]/50" /><Sparkles className="size-4" /><span className="h-px flex-1 bg-[#c8a65d]/50" /></div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#e8dbc0]">You are cordially invited to</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.9] text-[#f6e9c9] sm:text-7xl">Baqiyah <span className="text-3xl text-[#c8a65d] sm:text-4xl">&</span> Hassan</h1>
          <p className="mt-5 text-sm italic text-[#d7bd82]">Ummul Fadhl &nbsp;·&nbsp; Abu Nusaybah</p>
          <div className="mx-auto mt-10 max-w-xl border-y border-[#c8a65d]/50 py-5"><p className="font-serif text-2xl uppercase tracking-[0.08em] text-[#f2d991] sm:text-4xl">AQDU-NIKKAH &amp; WALEEMATU NIKKAH</p></div>
          <p className="mt-8 font-serif text-2xl text-[#f7f0df]">Welcome to the Beginning of Our Eternity</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#eadfcb]">United in faith, joined in love, and praying for a lifetime of barakah.</p>
          <div className="mx-auto mt-8 max-w-xl"><Countdown /></div>
          <a href="#invitation" className="mt-9 inline-flex items-center gap-2 rounded-full border border-[#d7bd82] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f7f0df] transition hover:bg-[#d7bd82] hover:text-[#3d0716]">Enter our love story <ArrowDown className="size-4" /></a>
        </div>
      </section>

      <WeddingMusicPlayer />

      <section className="relative overflow-hidden bg-[#f1e4cf] px-5 py-20 sm:py-28">
        <div className="relative z-10 mx-auto max-w-6xl pb-36 text-center sm:pb-60">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a57d35]">A keepsake of forever</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl text-[#5a0b1d] sm:text-6xl">Burgundy, gold &amp; a lifetime of barakah.</h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#704753]">The invitation, flowers, wax seal, and warm lantern light set the tone for every detail of this celebration.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[#5a0b1d]"><span className="rounded-full border border-[#a57d35]/40 bg-[#fffaf0] px-4 py-2">Velvet burgundy</span><span className="rounded-full border border-[#a57d35]/40 bg-[#fffaf0] px-4 py-2">Antique gold</span><span className="rounded-full border border-[#a57d35]/40 bg-[#fffaf0] px-4 py-2">Ivory florals</span></div>
        </div>
        <img src={FLORAL_GARLAND_IMAGE} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-auto w-[min(100%,1100px)] max-h-[min(38vw,240px)] object-contain object-bottom opacity-75" />
      </section>

      <section aria-label="Wedding welcome banner" className="wedding-marquee overflow-hidden border-y border-[#c8a65d]/50 bg-[#5a0b1d] py-4 text-[#f2d991]">
        <p className="sr-only">You&apos;re welcome to Everlasting Khayr. #EverlastingKhayr&apos;26. Baqiyah and Hassan.</p>
        <div aria-hidden="true" className="wedding-marquee-track flex w-max items-center gap-8 whitespace-nowrap font-serif text-base uppercase tracking-[0.16em] sm:text-xl">
          {Array.from({ length: 4 }, (_, index) => <span key={index} className="inline-flex items-center gap-5">You&apos;re welcome to Everlasting Khayr <Sparkles aria-hidden="true" className="size-4" /> #EverlastingKhayr&apos;26 <Heart aria-hidden="true" className="size-4" /> Baqiyah &amp; Hassan</span>)}
        </div>
      </section>

      <section id="gallery" className="bg-[#f7f0df] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#a57d35]">A glimpse of the celebration</p>
            <h2 className="mt-3 font-serif text-4xl text-[#5a0b1d] sm:text-5xl">Wedding Gallery</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 md:gap-8">
            <figure>
              <button type="button" onClick={() => setActiveGalleryImage({ src: INVITATION_IMAGE, alt: 'Baqiyah and Hassan AQDU-NIKKAH wedding invitation' })} className="group block w-full overflow-hidden rounded-xl border border-[#c8a65d]/50 bg-[#eadcc1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a57d35]" aria-label="View wedding invitation larger">
                <img src={INVITATION_IMAGE} alt="Baqiyah and Hassan AQDU-NIKKAH wedding invitation" className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              </button>
              <figcaption className="mt-3 text-center font-serif text-lg text-[#5a0b1d]">The Wedding Invitation</figcaption>
            </figure>
            <figure>
              <button type="button" onClick={() => setActiveGalleryImage({ src: ELEGANCE_IMAGE, alt: 'Burgundy and gold wedding invitation styling for Baqiyah and Hassan' })} className="group block w-full overflow-hidden rounded-xl border border-[#c8a65d]/50 bg-[#5a0b1d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a57d35]" aria-label="View burgundy and gold invitation styling larger">
                <img src={ELEGANCE_IMAGE} alt="Burgundy and gold wedding invitation styling for Baqiyah and Hassan" className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              </button>
              <figcaption className="mt-3 text-center font-serif text-lg text-[#5a0b1d]">Burgundy &amp; Gold Details</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {activeGalleryImage && <div role="presentation" onClick={() => setActiveGalleryImage(null)} className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4 sm:p-8">
        <div role="dialog" aria-modal="true" aria-label={activeGalleryImage.alt} className="relative max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => setActiveGalleryImage(null)} aria-label="Close enlarged gallery image" className="absolute -right-2 -top-12 grid size-10 place-items-center rounded-full border border-white/40 bg-[#3d0716] text-white hover:bg-[#5a0b1d]"><X aria-hidden="true" /></button>
          <img src={activeGalleryImage.src} alt={activeGalleryImage.alt} className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        </div>
      </div>}

      <section id="messages" className="px-5 py-20 sm:py-28"><div className="mx-auto max-w-5xl"><div className="mb-12 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#a57d35]">Words from the heart</p><h2 className="mt-3 font-serif text-4xl sm:text-6xl">To you, my beloved…</h2></div><div className="grid gap-6 md:grid-cols-2"><article className="rounded-[2rem] border border-[#d7bd82]/60 bg-[#fffaf0] p-7 shadow-sm sm:p-10"><p className="font-serif text-2xl text-[#5a0b1d]">Baqiyah</p><div className="mt-5 space-y-4 text-sm leading-7 text-[#704753]"><p>If I could make one du&apos;a for our forever, it would be that Allah always keeps us close to Him and, through that closeness, keeps us close to each other.</p><p>I pray to be your peace after a long day, your comfort in difficult moments, your biggest cheerleader in every season, and the one whose presence reminds you that you are deeply loved.</p><p>May we never grow tired of choosing each other, learning each other, forgiving each other, and making du&apos;a for one another. May Allah place barakah in our home, sweetness in our companionship, and make our love a means of drawing closer to Him.</p><p>Here&apos;s to you, my husband, my answered du&apos;a, and my partner in this beautiful journey. May this life be kind to us, and may Jannah be our ultimate destination.</p><p className="font-serif text-lg text-[#5a0b1d]">Aameen.</p></div></article><article className="rounded-[2rem] bg-[#5a0b1d] p-7 text-[#f7f0df] shadow-sm sm:p-10"><p className="font-serif text-2xl text-[#f2d991]">My Dearest Baqiyah</p><div className="mt-5 space-y-4 text-sm leading-7 text-[#eadfcb]"><p>Today, I thank Allah for blessing me with you. You are not just the woman I love, but my best friend, my companion, and the person I want to spend the rest of my life with.</p><p>Thank you for choosing me, loving me, and standing by me. I promise to always support you, cherish you, make you smile, and keep choosing you every single day.</p><p>May Allah bless our marriage with love, peace, understanding, and endless happiness, and may He keep us together for many beautiful years to come.</p><p className="font-serif text-lg text-[#f2d991]">Aameen</p></div></article></div></div></section>

      <section id="venue" className="bg-[#f1e4cf] px-5 py-20 sm:py-28"><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#a57d35]">Join us in Lagos</p><h2 className="mt-3 font-serif text-4xl text-[#5a0b1d] sm:text-5xl">Harmony Event Centre</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#704753]">36 Abeokuta Street, by Tapa, Oyingbo, Ebute Metta, Lagos State, Nigeria</p></header><div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"><iframe title="Map for Harmony Event Centre" src={`https://www.google.com/maps?q=${encodeURIComponent(VENUE_ADDRESS)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full rounded-[2rem] border border-[#c8a65d]/60 sm:h-96"/><div className="rounded-[2rem] border border-[#c8a65d]/60 bg-[#fffaf0] p-6 sm:p-8"><MapPin className="size-6 text-[#a57d35]"/><p className="mt-3 font-serif text-2xl text-[#5a0b1d]">Find Your Way to Everlasting Khayr</p><p className="mt-3 text-sm leading-7 text-[#704753]">Choose your starting area to open a route in Google Maps.</p><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE_ADDRESS)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#5a0b1d] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7f0df] hover:bg-[#3d0716]">Get Directions <ArrowUpRight className="size-4"/></a><div className="mt-5 grid grid-cols-2 gap-2">{['Oshodi', 'Ikorodu', 'Yaba', 'Other locations'].map((origin) => <a key={origin} href={`https://www.google.com/maps/dir/?api=1&${origin === 'Other locations' ? '' : `origin=${encodeURIComponent(`${origin}, Lagos, Nigeria`)}&`}destination=${encodeURIComponent(VENUE_ADDRESS)}`} target="_blank" rel="noreferrer" className="rounded-xl border border-[#a57d35]/40 px-3 py-3 text-center text-xs font-medium text-[#5a0b1d] transition hover:bg-[#f1e4cf]">{origin}</a>)}</div></div></div></div></section>
      <section id="rsvp" className="bg-[#eadcc1] px-5 py-20 sm:py-28"><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#a57d35]">Be our guest</p><h2 className="mt-3 font-serif text-4xl text-[#5a0b1d] sm:text-5xl">RSVP</h2><p className="mt-3 text-sm text-[#704753]">Please let us know if you will be joining us.</p></header><div className="grid gap-8 lg:grid-cols-2 lg:items-start"><div className="rounded-[2rem] border border-[#c8a65d]/60 bg-[#fffaf0] p-6 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a0b1d]">Will you be attending?</p><div role="group" aria-label="Choose your attendance" className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" disabled={savingVote === 'attendance'} aria-pressed={attendanceChoice === 'attending'} onClick={() => setAttendanceChoice('attending')} className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition ${attendanceChoice === 'attending' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#fffaf0]' : 'border-[#a57d35]/50 bg-white text-[#5a0b1d] hover:bg-[#f1e4cf]'}`}>I will be attending</button><button type="button" disabled={savingVote === 'attendance'} aria-pressed={attendanceChoice === 'not-attending'} onClick={() => setAttendanceChoice('not-attending')} className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition ${attendanceChoice === 'not-attending' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#fffaf0]' : 'border-[#a57d35]/50 bg-white text-[#5a0b1d] hover:bg-[#f1e4cf]'}`}>I will not be attending</button></div><p role="status" className="mt-4 min-h-5 text-sm font-medium text-[#704753]">{attendanceChoice === 'attending' ? 'Your selection: attending.' : attendanceChoice === 'not-attending' ? 'Your selection: not attending.' : 'Choose an option to mark your response.'}</p><p role="status" className="mt-3 text-xs text-[#704753]">{feedbackStatus}</p><p className="mt-2 border-t border-[#a57d35]/30 pt-2 text-xs font-medium text-[#5a0b1d]">People Attending: {attendanceVotes.attending} ({attendingPercent}%) <span aria-hidden="true">·</span> People Not Attending: {attendanceVotes.notAttending} ({notAttendingPercent}%)</p><p className="mt-6 border-t border-[#a57d35]/30 pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5a0b1d]">For RSVP enquiries</p><div className="mt-3 grid gap-3 text-sm"><div className="flex items-center gap-3"><Phone className="size-4 text-[#a57d35]" /><a href="tel:07068412936" className="hover:underline">Abu Zayd · 07068412936</a></div><div className="flex items-center gap-3"><Phone className="size-4 text-[#a57d35]" /><a href="tel:+2348104086052" className="hover:underline">Abu Abdullah · +234 810 408 6052</a></div><div className="flex items-center gap-3"><Phone className="size-4 text-[#a57d35]" /><a href="tel:09078204221" className="hover:underline">Idris · 09078204221</a></div></div></div><div className="rounded-[2rem] border border-[#c8a65d]/60 bg-[#fffaf0] p-6 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.12em]">Leave a website review</p><button type="button" onClick={() => { setReviewFormOpen((open) => !open); setReviewSubmitStatus('') }} className="mt-3 rounded-full border border-[#a57d35]/60 px-5 py-2.5 text-sm font-semibold text-[#5a0b1d] transition hover:bg-[#f1e4cf]">{reviewFormOpen ? 'Close review form' : 'Leave a Review'}</button>{reviewFormOpen && <form onSubmit={submitWrittenReview} className="mt-4 grid gap-3 rounded-2xl border border-[#c8a65d]/40 bg-white/70 p-4"><label className="grid gap-2 text-xs font-medium text-[#5a0b1d]">Your name<input required maxLength={80} value={reviewName} onChange={(event) => setReviewName(event.target.value)} className="rounded-xl border border-[#a57d35]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#5a0b1d]" /></label><label className="grid gap-2 text-xs font-medium text-[#5a0b1d]">Your review<textarea required maxLength={1000} rows={4} value={reviewMessage} onChange={(event) => setReviewMessage(event.target.value)} className="resize-y rounded-xl border border-[#a57d35]/40 bg-white px-3 py-2 text-sm outline-none focus:border-[#5a0b1d]" /></label><button type="submit" disabled={reviewSubmitting} className="rounded-full bg-[#5a0b1d] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60">{reviewSubmitting ? 'Saving…' : 'Submit review'}</button></form>}<p role="status" className="mt-2 text-xs text-[#704753]">{reviewSubmitStatus}</p><div role="group" aria-label="Choose a website review" className="mt-3 flex gap-3"><button type="button" disabled={savingVote === 'review'} aria-pressed={reviewChoice === 'stunning'} onClick={() => castReviewVote('stunning')} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${reviewChoice === 'stunning' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#f7f0df]' : 'border-[#a57d35]/60 bg-[#fffaf0] hover:bg-[#f7f0df]'}`}>Stunning</button><button type="button" disabled={savingVote === 'review'} aria-pressed={reviewChoice === 'fair'} onClick={() => castReviewVote('fair')} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${reviewChoice === 'fair' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#f7f0df]' : 'border-[#a57d35]/60 bg-[#fffaf0] hover:bg-[#f7f0df]'}`}>Fair</button></div><div className="mt-4 space-y-3"><div><div className="mb-1 flex justify-between text-xs"><span>Stunning</span><span>{reviewVotes.stunning} · {stunningPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#fffaf0]"><div className="h-full rounded-full bg-[#a57d35] transition-[width]" style={{ width: `${stunningPercent}%` }} /></div></div><div><div className="mb-1 flex justify-between text-xs"><span>Fair</span><span>{reviewVotes.fair} · {fairPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#fffaf0]"><div className="h-full rounded-full bg-[#5a0b1d] transition-[width]" style={{ width: `${fairPercent}%` }} /></div></div></div><p role="status" className="mt-3 text-xs font-medium">{reviewLeader}</p><p role="status" className="mt-2 text-xs text-[#704753]">{feedbackStatus}</p><details className="mt-4 border-t border-[#a57d35]/30 pt-3"><summary className="cursor-pointer rounded-xl px-2 py-2 text-sm font-semibold text-[#5a0b1d] focus-visible:outline-2 focus-visible:outline-[#a57d35]">Read Website Reviews ({writtenReviewCount})</summary><p className="mt-2 text-xs text-[#704753]">Showing {writtenReviews.length} of {writtenReviewCount} submitted reviews.</p><div className="mt-2 max-h-80 space-y-2 overflow-y-auto pr-1" aria-live="polite">{writtenReviews.map((review, index) => <article key={`${review.submitted_at}-${index}`} className="rounded-xl bg-white/80 p-3"><p className="font-serif text-base text-[#5a0b1d]">{review.name}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#704753]">{review.message}</p></article>)}</div>{reviewsLoadError && <p role="alert" className="mt-2 text-xs text-[#8b1e2d]">{reviewsLoadError}</p>}{reviewsHasMore && <button type="button" disabled={reviewsLoading} onClick={loadMoreReviews} className="mt-3 w-full rounded-full border border-[#a57d35]/60 px-4 py-2.5 text-xs font-semibold text-[#5a0b1d] disabled:opacity-60">{reviewsLoading ? 'Loading reviews…' : 'Load more reviews'}</button>}</details></div></div></div></section>

      <section id="wishes" className="bg-[#5a0b1d] px-5 py-20 text-[#f7f0df] sm:py-28">
  <div className="mx-auto max-w-5xl">
    <div className="text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[#d7bd82]">A wall of love</p>
      <h2 className="mt-3 font-serif text-4xl sm:text-6xl">Leave a prayer for their forever</h2>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#eadfcb]">Before their forever begins, leave Hassan and Baqiyah a beautiful wish or du&apos;a for their marriage.</p>
    </div>
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={submitGuestWish} className="rounded-[2rem] border border-[#d7bd82]/50 bg-[#3d0716]/60 p-6">
        <div className="grid gap-4">
          <label className="grid gap-2 text-xs uppercase tracking-[0.12em] text-[#d7bd82]">Your name<input required maxLength={80} value={wishName} onChange={(event) => setWishName(event.target.value)} className="rounded-xl border border-[#c8a65d]/40 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#f7f0df] outline-none placeholder:text-[#eadfcb]/50" placeholder="How should we sign it?" /></label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.12em] text-[#d7bd82]">Your relationship to the couple<input maxLength={80} value={wishRelationship} onChange={(event) => setWishRelationship(event.target.value)} className="rounded-xl border border-[#c8a65d]/40 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#f7f0df] outline-none placeholder:text-[#eadfcb]/50" placeholder="Friend, family, colleague..." /></label>
          <label className="grid gap-2 text-xs uppercase tracking-[0.12em] text-[#d7bd82]">Your message or prayer<textarea required maxLength={1000} value={wishText} onChange={(event) => setWishText(event.target.value)} rows={5} className="resize-none rounded-xl border border-[#c8a65d]/40 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#f7f0df] outline-none placeholder:text-[#eadfcb]/50" placeholder="Write a beautiful du&apos;a..." /></label>
          <p className="text-xs text-[#eadfcb]/70">{guestMessageCount} guest messages submitted</p>
          <button type="submit" disabled={wishSubmitting} className="rounded-full bg-[#d7bd82] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#3d0716] hover:bg-[#f2d991] disabled:cursor-not-allowed disabled:opacity-50">{wishSubmitting ? 'Saving…' : 'Submit prayer'}</button>
          <p role="status" className="min-h-5 text-xs text-[#eadfcb]">{wishSubmitStatus}</p>
        </div>
      </form>
      <details className="rounded-[2rem] border border-[#d7bd82]/50 bg-[#3d0716]/60 p-5">
        <summary className="cursor-pointer font-serif text-xl text-[#f2d991]">Read Guest Prayers &amp; Messages ({guestMessageCount} submitted)</summary>
        <div className="mt-4 grid content-start gap-4" aria-live="polite">
          {visibleWishes.map((wish, index) => <article key={`${wish.name}-${index}`} className="rounded-2xl bg-[#f7f0df] p-5 text-[#5a0b1d]"><div className="flex items-center justify-between gap-4"><p className="font-serif text-xl">{wish.name}</p><MessageCircleHeart className="text-[#a57d35]" /></div>{wish.relationship && <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#a57d35]">{wish.relationship}</p>}<p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#704753]">{wish.message}</p></article>)}
          {displayedWishes.length > wishes.length && <button type="button" aria-expanded={showAllWishes} onClick={() => setShowAllWishes((showAll) => !showAll)} className="w-full rounded-full border border-[#d7bd82]/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f7f0df] transition hover:bg-[#3d0716]">{showAllWishes ? 'Show fewer messages' : `Show all messages (${displayedWishes.length})`}</button>}
          {showAllWishes && guestMessagesHasMore && <button type="button" disabled={guestMessagesLoading} onClick={loadMoreGuestMessages} className="w-full rounded-full border border-[#d7bd82]/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f7f0df] disabled:opacity-60">{guestMessagesLoading ? 'Loading messages…' : 'Load more messages'}</button>}
          {guestMessagesLoadError && <p role="alert" className="text-xs text-[#f2d991]">{guestMessagesLoadError}</p>}
        </div>
      </details>
    </div>
  </div>
</section>

      <section className="bg-[#f7f0df] px-5 py-20 text-center"><Heart className="mx-auto text-[#a57d35]" /><h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl text-[#5a0b1d] sm:text-5xl">May Allah bless this union, shower His blessings upon the couple, and unite them in goodness.</h2><button onClick={recordAmeen} className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#5a0b1d] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a0b1d] hover:bg-[#5a0b1d] hover:text-[#f7f0df]"><Sparkles className="size-4" /> Aameen <span aria-live="polite">· {ameenCount}</span></button></section>

      <footer className="relative overflow-hidden bg-[#3d0716] px-5 pt-14 pb-44 text-center text-[#f7f0df] sm:pb-76">
        <img src={FLORAL_GARLAND_IMAGE} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-auto w-[min(100%,1100px)] max-h-[min(38vw,240px)] object-contain object-bottom opacity-75" />
        <div className="relative z-10 mx-auto max-w-2xl rounded-[2rem] border border-[#c8a65d]/50 bg-[#5a0b1d]/80 p-7">
          <Mail aria-hidden="true" className="mx-auto size-8 text-[#d7bd82]" /><p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#d7bd82]">A love letter from</p><p className="mt-2 font-serif text-3xl text-[#f2d991]">Baqiyah & Hassan</p><div className="mt-3 flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-[#d7bd82]"><span className="hashtag-drift hashtag-drift-one">#EverlastingKhayr&apos;26</span><span className="hashtag-drift hashtag-drift-two">#Foladamilare</span></div><p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#d7bd82]">Chat with us on WhatsApp</p><a href="https://wa.me/2349159161703" target="_blank" rel="noreferrer" className="mt-2 inline-block font-serif text-xl text-[#f2d991] underline decoration-[#c8a65d]/60 underline-offset-4 transition hover:text-[#fff4c9]" aria-label="Chat with Baqiyah and Hassan on WhatsApp at +2349159161703">+2349159161703</a><p className="mt-6 text-xs text-[#eadfcb]">Website created by <strong className="font-semibold text-[#f2d991]">Bushrah Digitals</strong></p></div>
        <div className="relative z-10 mx-auto my-7 flex max-w-xs items-center gap-3 text-[#c8a65d]"><span className="h-px flex-1 bg-[#c8a65d]/50" /><ChevronDown className="size-4" /><span className="h-px flex-1 bg-[#c8a65d]/50" /></div>
        <p className="relative z-10 text-xs text-[#eadfcb]">With love, gratitude, and du&apos;a.</p>
      </footer>
    </main>
  )
}
