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
const MAX_GUEST_WISHES = 300
const GUEST_WISHES_STORAGE_KEY = 'everlasting-khayr-guest-wishes'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [ameenCount, setAmeenCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [wishName, setWishName] = useState('')
  const [wishRelationship, setWishRelationship] = useState('')
  const [wishText, setWishText] = useState('')
  const [attendanceChoice, setAttendanceChoiceState] = useState<'attending' | 'not-attending' | null>(null)
  const [attendanceVotes, setAttendanceVotes] = useState({ attending: 0, notAttending: 0 })
  const [guestWishes, setGuestWishes] = useState<WeddingWish[]>([])
  const [showAllWishes, setShowAllWishes] = useState(false)
  const [activeGalleryImage, setActiveGalleryImage] = useState<{ src: string; alt: string } | null>(null)
  const [reviewVotes, setReviewVotes] = useState({ stunning: 0, fair: 0 })
  const [reviewChoice, setReviewChoice] = useState<'stunning' | 'fair' | null>(null)

  const dateLabel = useMemo(() =>
    new Intl.DateTimeFormat('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' }).format(EVENT_DATE).replace(/\b20\b/, '20th'), [])

  useEffect(() => {
    try {
      const savedCount = Number(window.localStorage.getItem('everlasting-khayr-ameen-count'))
      if (Number.isSafeInteger(savedCount) && savedCount > 0) setAmeenCount(savedCount)
      const savedReviewVotes = window.localStorage.getItem('everlasting-khayr-review-votes')
      if (savedReviewVotes) {
        const parsedVotes = JSON.parse(savedReviewVotes) as { stunning?: number; fair?: number }
        setReviewVotes({ stunning: parsedVotes.stunning ?? 0, fair: parsedVotes.fair ?? 0 })
      }
      const savedReviewChoice = window.localStorage.getItem('everlasting-khayr-review-choice')
      if (savedReviewChoice === 'stunning' || savedReviewChoice === 'fair') setReviewChoice(savedReviewChoice)
      const savedAttendanceVotes = window.localStorage.getItem('everlasting-khayr-attendance-votes')
      if (savedAttendanceVotes) {
        const parsedVotes = JSON.parse(savedAttendanceVotes) as { attending?: number; notAttending?: number }
        setAttendanceVotes({ attending: parsedVotes.attending ?? 0, notAttending: parsedVotes.notAttending ?? 0 })
      }
      const savedAttendanceChoice = window.localStorage.getItem('everlasting-khayr-attendance-choice')
      if (savedAttendanceChoice === 'attending' || savedAttendanceChoice === 'not-attending') setAttendanceChoiceState(savedAttendanceChoice)
      const savedGuestWishes = window.localStorage.getItem(GUEST_WISHES_STORAGE_KEY)
      if (savedGuestWishes) {
        const parsedWishes = JSON.parse(savedGuestWishes) as unknown
        if (Array.isArray(parsedWishes)) {
          const validWishes = parsedWishes.filter((wish): wish is WeddingWish =>
            typeof wish?.name === 'string' &&
            typeof wish?.message === 'string' &&
            typeof wish?.relationship === 'string'
          )
          setGuestWishes(validWishes.slice(0, MAX_GUEST_WISHES))
        }
      }
    } catch {
      // The counter remains available for this visit if browser storage is disabled.
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

  const castAttendanceVote = (choice: 'attending' | 'not-attending') => {
    setAttendanceVotes((currentVotes) => {
      const nextVotes = { ...currentVotes }
      if (attendanceChoice === 'attending') nextVotes.attending = Math.max(0, nextVotes.attending - 1)
      if (attendanceChoice === 'not-attending') nextVotes.notAttending = Math.max(0, nextVotes.notAttending - 1)
      nextVotes[choice === 'attending' ? 'attending' : 'notAttending'] += 1
      try {
        window.localStorage.setItem('everlasting-khayr-attendance-votes', JSON.stringify(nextVotes))
        window.localStorage.setItem('everlasting-khayr-attendance-choice', choice)
      } catch {
        // The tally remains available for this visit if browser storage is unavailable.
      }
      return nextVotes
    })
    setAttendanceChoiceState(choice)
  }

  const setAttendanceChoice = castAttendanceVote

  const castReviewVote = (choice: 'stunning' | 'fair') => {
    setReviewVotes((currentVotes) => {
      const nextVotes = { ...currentVotes }
      if (reviewChoice) nextVotes[reviewChoice] = Math.max(0, nextVotes[reviewChoice] - 1)
      nextVotes[choice] += 1
      try {
        window.localStorage.setItem('everlasting-khayr-review-votes', JSON.stringify(nextVotes))
        window.localStorage.setItem('everlasting-khayr-review-choice', choice)
      } catch {
        // Voting still works for this visit if browser storage is unavailable.
      }
      return nextVotes
    })
    setReviewChoice(choice)
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
  const reviewLeader = <><span>{reviewLeaderText}</span><span className="mt-2 block border-t border-[#a57d35]/30 pt-2 font-normal">RSVP tally: {attendanceVotes.attending} attending ({attendingPercent}%) · {attendanceVotes.notAttending} not attending ({notAttendingPercent}%)</span></>

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f0df] text-[#3d0716] selection:bg-[#c8a65d]/30">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#3d0716]/90 px-5 py-4 text-[#f7f0df] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="#top" className="font-serif text-lg tracking-[0.18em] text-[#ead3a0]" aria-label="Everlasting Khayr 2026">EK&apos;26</a>
          <div className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.2em] md:flex">
            <a href="#invitation" className="transition-colors hover:text-[#d7bd82]">Invitation</a><a href="#gallery" className="transition-colors hover:text-[#d7bd82]">Gallery</a><a href="#messages" className="transition-colors hover:text-[#d7bd82]">Messages</a><a href="#rsvp" className="transition-colors hover:text-[#d7bd82]">RSVP</a><a href="#wishes" className="transition-colors hover:text-[#d7bd82]">Wishes</a>
          </div>
          <button className="rounded-full p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-4 text-center text-xs uppercase tracking-[0.2em] md:hidden"><a href="#invitation" onClick={() => setMenuOpen(false)}>Invitation</a><a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a><a href="#messages" onClick={() => setMenuOpen(false)}>Messages</a><a href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP</a><a href="#wishes" onClick={() => setMenuOpen(false)}>Wishes</a></div>}
      </nav>

      <section id="top" className="relative flex min-h-[760px] items-center justify-center bg-[#3d0716] px-5 pb-20 pt-32 text-center text-[#f7f0df]">
        <div className="absolute inset-0 opacity-0 sm:opacity-25" style={{ backgroundImage: `url(${INVITATION_IMAGE})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#3d0716_78%)]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="font-serif text-3xl text-[#e4c984] sm:text-4xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.33em] text-[#d7bd82]">Bismillahir Rahmanir Raheem</p>
          <div className="mx-auto my-8 flex max-w-xs items-center gap-3 text-[#c8a65d]"><span className="h-px flex-1 bg-[#c8a65d]/50" /><Sparkles className="size-4" /><span className="h-px flex-1 bg-[#c8a65d]/50" /></div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#e8dbc0]">You are cordially invited to</p>
          <h1 className="mt-5 font-serif text-5xl leading-[0.9] text-[#f6e9c9] sm:text-7xl">Baqiyah <span className="text-3xl text-[#c8a65d] sm:text-4xl">&</span> Hassan</h1>
          <p className="mt-5 text-sm italic text-[#d7bd82]">Ummul Fadhl &nbsp;·&nbsp; Abu Nusaybah</p>
          <div className="mx-auto mt-10 max-w-xl border-y border-[#c8a65d]/50 py-5"><p className="font-serif text-2xl uppercase tracking-[0.08em] text-[#f2d991] sm:text-4xl">AQDU-NIKKAH &amp; WALEEMATU NIKKAH</p></div>
          <p className="mt-8 font-serif text-2xl text-[#f7f0df]">Welcome to the Beginning of Our Eternity</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#eadfcb]">United in faith, joined in love, and praying for a lifetime of barakah.</p>
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

      <section id="rsvp" className="bg-[#eadcc1] px-5 py-20 sm:py-28"><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#a57d35]">Be our guest</p><h2 className="mt-3 font-serif text-4xl text-[#5a0b1d] sm:text-5xl">RSVP</h2><p className="mt-3 text-sm text-[#704753]">Please let us know if you will be joining us.</p></header><div className="grid gap-8 lg:grid-cols-2 lg:items-start"><div className="rounded-[2rem] border border-[#c8a65d]/60 bg-[#fffaf0] p-6 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a0b1d]">Will you be attending?</p><div role="group" aria-label="Choose your attendance" className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" aria-pressed={attendanceChoice === 'attending'} onClick={() => setAttendanceChoice('attending')} className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition ${attendanceChoice === 'attending' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#fffaf0]' : 'border-[#a57d35]/50 bg-white text-[#5a0b1d] hover:bg-[#f1e4cf]'}`}>I will be attending</button><button type="button" aria-pressed={attendanceChoice === 'not-attending'} onClick={() => setAttendanceChoice('not-attending')} className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-semibold transition ${attendanceChoice === 'not-attending' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#fffaf0]' : 'border-[#a57d35]/50 bg-white text-[#5a0b1d] hover:bg-[#f1e4cf]'}`}>I will not be attending</button></div><p role="status" className="mt-4 min-h-5 text-sm font-medium text-[#704753]">{attendanceChoice === 'attending' ? 'Thank you. Your response is marked: attending.' : attendanceChoice === 'not-attending' ? 'Thank you. Your response is marked: not attending.' : 'Choose an option to mark your response.'}</p><p className="mt-6 border-t border-[#a57d35]/30 pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5a0b1d]">For RSVP enquiries</p><div className="mt-3 grid gap-3 text-sm"><div className="flex items-center gap-3"><Phone className="size-4 text-[#a57d35]" /><a href="tel:07068412936" className="hover:underline">Abu Zayd · 07068412936</a></div><div className="flex items-center gap-3"><Phone className="size-4 text-[#a57d35]" /><a href="tel:+2348104086052" className="hover:underline">Abu Abdullah · +234 810 408 6052</a></div><div className="flex items-center gap-3"><Phone className="size-4 text-[#a57d35]" /><a href="tel:09078204221" className="hover:underline">Idris · 09078204221</a></div></div></div><div className="rounded-[2rem] border border-[#c8a65d]/60 bg-[#fffaf0] p-6 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.12em]">Leave a website review</p><div role="group" aria-label="Choose a website review" className="mt-3 flex gap-3"><button type="button" aria-pressed={reviewChoice === 'stunning'} onClick={() => castReviewVote('stunning')} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${reviewChoice === 'stunning' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#f7f0df]' : 'border-[#a57d35]/60 bg-[#fffaf0] hover:bg-[#f7f0df]'}`}>Stunning</button><button type="button" aria-pressed={reviewChoice === 'fair'} onClick={() => castReviewVote('fair')} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${reviewChoice === 'fair' ? 'border-[#5a0b1d] bg-[#5a0b1d] text-[#f7f0df]' : 'border-[#a57d35]/60 bg-[#fffaf0] hover:bg-[#f7f0df]'}`}>Fair</button></div><div className="mt-4 space-y-3"><div><div className="mb-1 flex justify-between text-xs"><span>Stunning</span><span>{reviewVotes.stunning} · {stunningPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#fffaf0]"><div className="h-full rounded-full bg-[#a57d35] transition-[width]" style={{ width: `${stunningPercent}%` }} /></div></div><div><div className="mb-1 flex justify-between text-xs"><span>Fair</span><span>{reviewVotes.fair} · {fairPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#fffaf0]"><div className="h-full rounded-full bg-[#5a0b1d] transition-[width]" style={{ width: `${fairPercent}%` }} /></div></div></div><p role="status" className="mt-3 text-xs font-medium">{reviewLeader}</p></div></div></div></section>

      <section id="wishes" className="bg-[#5a0b1d] px-5 py-20 text-[#f7f0df] sm:py-28"><div className="mx-auto max-w-5xl"><div className="text-center"><p className="text-xs uppercase tracking-[0.3em] text-[#d7bd82]">A wall of love</p><h2 className="mt-3 font-serif text-4xl sm:text-6xl">Leave a prayer for their forever</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#eadfcb]">Before their forever begins, leave Hassan and Baqiyah a beautiful wish or du&apos;a for their marriage.</p></div><div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><form onSubmit={(event) => {
  event.preventDefault()
  if (guestWishes.length >= MAX_GUEST_WISHES) return
  const nextWishes = [{ name: wishName.trim(), relationship: wishRelationship.trim(), message: wishText.trim() }, ...guestWishes]
  setGuestWishes(nextWishes)
  setShowAllWishes(true)
  try {
    window.localStorage.setItem(GUEST_WISHES_STORAGE_KEY, JSON.stringify(nextWishes))
  } catch {
    // Keep submissions visible for this visit if browser storage is unavailable.
  }
  setWishName('')
  setWishRelationship('')
  setWishText('')
}} className="rounded-[2rem] border border-[#d7bd82]/50 bg-[#3d0716]/60 p-6">
<div className="grid gap-4"><label className="grid gap-2 text-xs uppercase tracking-[0.12em] text-[#d7bd82]">Your name<input required disabled={guestWishes.length >= MAX_GUEST_WISHES} value={wishName} onChange={(e) => setWishName(e.target.value)} className="rounded-xl border border-[#c8a65d]/40 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#f7f0df] outline-none placeholder:text-[#eadfcb]/50 disabled:opacity-50" placeholder="How should we sign it?" /></label><label className="grid gap-2 text-xs uppercase tracking-[0.12em] text-[#d7bd82]">Your relationship to the couple<input required disabled={guestWishes.length >= MAX_GUEST_WISHES} value={wishRelationship} onChange={(e) => setWishRelationship(e.target.value)} className="rounded-xl border border-[#c8a65d]/40 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#f7f0df] outline-none placeholder:text-[#eadfcb]/50 disabled:opacity-50" placeholder="Friend, family, colleague..." /></label><label className="grid gap-2 text-xs uppercase tracking-[0.12em] text-[#d7bd82]">Your message or prayer<textarea required disabled={guestWishes.length >= MAX_GUEST_WISHES} value={wishText} onChange={(e) => setWishText(e.target.value)} rows={5} className="resize-none rounded-xl border border-[#c8a65d]/40 bg-transparent px-4 py-3 text-base normal-case tracking-normal text-[#f7f0df] outline-none placeholder:text-[#eadfcb]/50 disabled:opacity-50" placeholder="Write a beautiful du&apos;a..." /></label><p className="text-xs text-[#eadfcb]/70">{guestWishes.length} of {MAX_GUEST_WISHES} guest messages</p><button type="submit" disabled={guestWishes.length >= MAX_GUEST_WISHES} className="rounded-full bg-[#d7bd82] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#3d0716] hover:bg-[#f2d991] disabled:cursor-not-allowed disabled:opacity-50">{guestWishes.length >= MAX_GUEST_WISHES ? 'Message limit reached' : 'Submit prayer'}</button></div></form><div className="grid content-start gap-4" aria-live="polite">{visibleWishes.map((wish, index) => <article key={`${wish.name}-${index}`} className="rounded-2xl bg-[#f7f0df] p-5 text-[#5a0b1d]"><div className="flex items-center justify-between gap-4"><p className="font-serif text-xl">{wish.name}</p><MessageCircleHeart className="text-[#a57d35]" /></div>{wish.relationship && <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#a57d35]">{wish.relationship}</p>}<p className="mt-3 text-sm leading-7 text-[#704753]">{wish.message}</p></article>)}{displayedWishes.length > wishes.length && <button type="button" aria-expanded={showAllWishes} onClick={() => setShowAllWishes((showAll) => !showAll)} className="w-full rounded-full border border-[#d7bd82]/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f7f0df] transition hover:bg-[#3d0716]">{showAllWishes ? 'Show fewer messages' : `Show all messages (${displayedWishes.length})`}</button>}</div></div></div></section>

      <section className="bg-[#f7f0df] px-5 py-20 text-center"><Heart className="mx-auto text-[#a57d35]" /><h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl text-[#5a0b1d] sm:text-5xl">May Allah bless this union, shower His blessings upon the couple, and unite them in goodness.</h2><button onClick={recordAmeen} className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#5a0b1d] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#5a0b1d] hover:bg-[#5a0b1d] hover:text-[#f7f0df]"><Sparkles className="size-4" /> Aameen <span aria-live="polite">· {ameenCount}</span></button></section>

      <footer className="relative overflow-hidden bg-[#3d0716] px-5 pt-14 pb-44 text-center text-[#f7f0df] sm:pb-76">
        <img src={FLORAL_GARLAND_IMAGE} alt="" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-auto w-[min(100%,1100px)] max-h-[min(38vw,240px)] object-contain object-bottom opacity-75" />
        <div className="relative z-10 mx-auto max-w-2xl rounded-[2rem] border border-[#c8a65d]/50 bg-[#5a0b1d]/80 p-7">
          <Mail aria-hidden="true" className="mx-auto size-8 text-[#d7bd82]" /><p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#d7bd82]">A love letter from</p><p className="mt-2 font-serif text-3xl text-[#f2d991]">Baqiyah & Hassan</p><div className="mt-3 flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-[#d7bd82]"><span>#EverlastingKhayr&apos;26</span><span>#Foladamilare</span></div><p className="mt-6 text-xs uppercase tracking-[0.24em] text-[#d7bd82]">Chat with us on WhatsApp</p><a href="https://wa.me/2349159161703" target="_blank" rel="noreferrer" className="mt-2 inline-block font-serif text-xl text-[#f2d991] underline decoration-[#c8a65d]/60 underline-offset-4 transition hover:text-[#fff4c9]" aria-label="Chat with Baqiyah and Hassan on WhatsApp at +2349159161703">+2349159161703</a><p className="mt-6 text-xs text-[#eadfcb]">Website created by <strong className="font-semibold text-[#f2d991]">Bushrah Digitals</strong></p></div>
        <div className="relative z-10 mx-auto my-7 flex max-w-xs items-center gap-3 text-[#c8a65d]"><span className="h-px flex-1 bg-[#c8a65d]/50" /><ChevronDown className="size-4" /><span className="h-px flex-1 bg-[#c8a65d]/50" /></div>
        <p className="relative z-10 text-xs text-[#eadfcb]">With love, gratitude, and du&apos;a.</p>
      </footer>
    </main>
  )
}
