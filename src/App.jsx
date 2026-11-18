import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  AudioLines,
  Download,
  Heart,
  LayoutGrid,
  Search,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react'

const SOUNDS = [
  { id: 1, name: 'Andrew Has a Meeting', category: 'Meetings', file: 'AMAZING Andrew Has a Meetingi.mp3', color: '#ff6b4a', pattern: [9, 16, 25, 38, 46, 30, 20, 14, 9] },
  { id: 2, name: 'Fist My Bump', category: 'Reactions', file: 'FistMyBump.mp3', color: '#f7c653', pattern: [10, 25, 14, 41, 20, 35, 12, 27, 8] },
  { id: 3, name: 'Happy Task Completion', category: 'Tasks', file: 'HappyTaskCompletion.mp3', color: '#a78bfa', pattern: [7, 38, 12, 19, 45, 9, 26, 12, 30] },
  { id: 4, name: 'Not Optimal Inbox', category: 'Email', file: 'NotOptimalInbox.mp3', color: '#62d4b3', pattern: [28, 31, 35, 40, 42, 40, 35, 31, 28] },
  { id: 5, name: 'Probably Good Email', category: 'Email', file: 'ProbablyGoodEmail.mp3', color: '#5aa9ff', pattern: [42, 38, 34, 29, 24, 19, 14, 10, 7] },
  { id: 6, name: 'Survived Another Monday', category: 'Reactions', file: 'SurvivedAnotherMonday.mp3', color: '#ff80ad', pattern: [9, 14, 20, 26, 34, 43, 20, 31, 46] },
  { id: 7, name: 'New Email: Excitement Max', category: 'Email', file: 'newEmailExcitmentLevelsMax.mp3', color: '#fd8f52', pattern: [38, 44, 39, 34, 28, 21, 16, 11, 7] },
  { id: 8, name: 'Calendar Warning', category: 'Calendar', file: 'warningCalendar.mp3', color: '#e9d458', pattern: [12, 23, 37, 17, 42, 25, 33, 14, 9] },
  { id: 9, name: 'Good Morning', category: 'Greetings', file: 'GoodMorning.mp3', color: '#ffb24a', pattern: [8, 14, 23, 34, 45, 38, 27, 18, 10] },
  { id: 10, name: '5-Minute Panic Email', category: 'Email', file: '5minPanicEmail.mp3', color: '#ff705f', pattern: [40, 18, 35, 12, 46, 24, 38, 15, 30] },
  { id: 11, name: 'Exciting News', category: 'Reactions', file: 'ExcitingNews.mp3', color: '#6fdaac', pattern: [10, 18, 29, 41, 46, 34, 22, 15, 8] },
  { id: 12, name: 'Friday Has Arrived', category: 'Reactions', file: 'FridayArrival.mp3', color: '#f5c95c', pattern: [15, 28, 42, 24, 38, 46, 31, 19, 10] },
  { id: 13, name: 'Never Trust “Final”', category: 'CAD', file: 'NeverTrustADrawingNameFinal.mp3', color: '#9c8cff', pattern: [36, 42, 27, 18, 44, 23, 34, 12, 8] },
  { id: 14, name: 'Always Save', category: 'CAD', file: 'alwaysSave.mp3', color: '#59c7ed', pattern: [9, 17, 29, 40, 45, 36, 25, 16, 8] },
  { id: 15, name: 'Correct Outlook Button', category: 'Email', file: 'correctOutlookButton.mp3', color: '#72a7ff', pattern: [22, 38, 14, 44, 26, 35, 18, 30, 9] },
  { id: 16, name: 'Excited Email Fist Bump', category: 'Email', file: 'excitedEmailFistMyBump.mp3', color: '#ff8fb8', pattern: [12, 24, 39, 46, 32, 18, 41, 27, 10] },
  { id: 17, name: 'Inbox Zero Jazz Hands', category: 'Email', file: 'inboxZeroJazzHands.mp3', color: '#62dbca', pattern: [8, 31, 17, 44, 25, 40, 14, 35, 9] },
  { id: 18, name: 'Investigate Email', category: 'Email', file: 'invetigateEmail.mp3', color: '#ef9764', pattern: [34, 19, 42, 27, 14, 38, 23, 11, 30] },
  { id: 19, name: 'So Many Meetings', category: 'Meetings', file: 'manyMeetings.mp3', color: '#c194ff', pattern: [42, 34, 27, 21, 16, 12, 9, 7, 5] },
  { id: 20, name: 'Notifications Are Friends', category: 'Email', file: 'notificationsAreFriends.mp3', color: '#61c8ff', pattern: [10, 21, 35, 45, 29, 17, 40, 24, 8] },
  { id: 21, name: 'Quick CAD Edit', category: 'CAD', file: 'quickCADEdit.mp3', color: '#82d978', pattern: [14, 26, 41, 20, 45, 30, 18, 34, 9] },
  { id: 22, name: 'Reply All Warning', category: 'Email', file: 'replyAllWarning.mp3', color: '#ff665f', pattern: [46, 39, 32, 26, 20, 15, 11, 8, 5] },
  { id: 23, name: 'Why Is This Meeting an Hour?', category: 'Meetings', file: 'whyIsThisMeetingAnHourLong.mp3', color: '#d590f1', pattern: [39, 17, 31, 44, 23, 36, 14, 28, 8] },
  { id: 24, name: 'Work Complete: Andrew Happiness', category: 'Tasks', file: 'workCompleteAndrewHappiness.mp3', color: '#ffbc55', pattern: [9, 19, 31, 43, 46, 37, 25, 16, 8] },
  { id: 25, name: 'Rocky Also Has a Question', category: 'Rocky', file: 'alsoRockyHaveQuestion.mp3', color: '#ff9f5a', pattern: [11, 24, 39, 46, 33, 18, 42, 28, 9] },
  { id: 26, name: 'Rocky? No, Roddy Knows', category: 'Rocky', file: 'rockyNoRoddyKnow.mp3', color: '#8d9fff', pattern: [38, 17, 44, 26, 35, 13, 41, 22, 8] },
  { id: 27, name: 'Why the Root Folder?', category: 'Tech', file: 'whyRootFolder.mp3', color: '#64d6be', pattern: [8, 19, 32, 45, 29, 40, 17, 27, 10] },
]

const CATEGORIES = ['All sounds', 'Favorites', 'Meetings', 'Tasks', 'Email', 'Calendar', 'Reactions', 'Greetings', 'CAD', 'Rocky', 'Tech']

const soundUrl = (file) => `${import.meta.env.BASE_URL}sounds/${encodeURIComponent(file)}`

function useSoundEngine(volume) {
  const activeRef = useRef([])

  const stopAll = useCallback(() => {
    activeRef.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
    activeRef.current = []
  }, [])

  const play = useCallback((sound) => {
    const audio = new Audio(soundUrl(sound.file))
    audio.volume = volume / 100
    activeRef.current.push(audio)
    audio.addEventListener('ended', () => {
      activeRef.current = activeRef.current.filter((item) => item !== audio)
    }, { once: true })
    audio.play()
  }, [volume])

  return { play, stopAll }
}

function Waveform({ pattern }) {
  return (
    <div className="waveform" aria-hidden="true">
      {pattern.map((height, index) => <span key={index} style={{ height }} />)}
    </div>
  )
}

function App() {
  const [category, setCategory] = useState('All sounds')
  const [query, setQuery] = useState('')
  const [volume, setVolume] = useState(75)
  const [favorites, setFavorites] = useState([6, 9])
  const [playing, setPlaying] = useState(null)
  const [simpleView, setSimpleView] = useState(true)
  const [lastRandom, setLastRandom] = useState(null)
  const { play, stopAll } = useSoundEngine(volume)

  const visibleSounds = useMemo(() => SOUNDS.filter((sound) => {
    const categoryMatch = category === 'All sounds'
      || (category === 'Favorites' ? favorites.includes(sound.id) : sound.category === category)
    return categoryMatch && sound.name.toLowerCase().includes(query.toLowerCase())
  }), [category, favorites, query])

  const triggerSound = (sound) => {
    play(sound)
    setPlaying(sound.id)
    window.setTimeout(() => setPlaying((id) => id === sound.id ? null : id), 650)
  }

  const playRandomSound = () => {
    const choices = SOUNDS.filter((sound) => sound.id !== lastRandom?.id)
    const sound = choices[Math.floor(Math.random() * choices.length)]
    setLastRandom(sound)
    triggerSound(sound)
  }

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <main className={simpleView ? 'simple-mode' : ''}>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Soundwave home">
          {/* <span className="brand-mark"><AudioLines size={21} strokeWidth={2.5} /></span>
          <span>soundwave</span> */}
        </a>
        <div className="header-actions">
          <button className="view-toggle" onClick={() => setSimpleView((current) => !current)}>
            {simpleView ? <LayoutGrid size={15} /> : <Shuffle size={15} />}
            <span>{simpleView ? 'Library' : 'Random mode'}</span>
          </button>
          <label className="volume-control">
            <Volume2 size={17} />
            <input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
            <span>{volume}%</span>
          </label>
          <button className="stop-button" onClick={() => { stopAll(); setPlaying(null) }}>
            <Square size={11} fill="currentColor" /> Stop all
          </button>
        </div>
      </header>

      <section className="simple-view">
        <div className="simple-orbit" aria-hidden="true" />
        <p className="simple-kicker">Random transmission</p>
        <button className={`random-button ${playing ? 'playing' : ''}`} onClick={playRandomSound}>
          <Shuffle size={42} strokeWidth={1.6} />
          <strong>Play a sound</strong>
          <span>Tap for random</span>
        </button>
        <div className="random-result" aria-live="polite">
          {lastRandom ? (
            <>
              <span>Now transmitting</span>
              <strong>{lastRandom.name}</strong>
            </>
          ) : (
            <span>{SOUNDS.length} sounds standing by</span>
          )}
        </div>
      </section>

      <section className="hero">
        <div>
          {/* <div className="eyebrow"><Sparkles size={14} /> Your instant audio palette</div> */}
          <h1>Andrew & <em>r0cky.</em></h1>
          {/* <p>Tap a pad, catch a vibe. Your favorite sounds are always one beat away.</p> */}
        </div>
        <div className="hero-visual" aria-hidden="true">
          {[22, 46, 70, 38, 88, 55, 76, 32, 62, 44, 80, 26].map((height, index) => (
            <span key={index} style={{ height: `${height}%`, animationDelay: `${index * -0.09}s` }} />
          ))}
        </div>
      </section>

      <section className="soundboard">
        <div className="controls">
          <nav className="categories" aria-label="Sound categories">
            {CATEGORIES.map((item) => (
              <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
                {item === 'Favorites' && <Heart size={13} fill={category === item ? 'currentColor' : 'none'} />}
                {item}
              </button>
            ))}
          </nav>
          <label className="search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sounds" />
            {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}
          </label>
        </div>

        <div className="section-title">
          <div>
            <p>{category === 'All sounds' ? 'Sound library' : category}</p>
            <span>{visibleSounds.length} sounds ready to play</span>
          </div>
          <button className="filter-button" aria-label="Filter sounds"><SlidersHorizontal size={16} /></button>
        </div>

        {visibleSounds.length ? (
          <div className="pad-grid">
            {visibleSounds.map((sound, index) => (
              <article
                className={`sound-pad ${playing === sound.id ? 'playing' : ''}`}
                key={sound.id}
                onClick={() => triggerSound(sound)}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') triggerSound(sound) }}
                role="button"
                tabIndex="0"
                style={{ '--accent': sound.color, '--delay': `${index * 35}ms` }}
              >
                <div className="pad-top">
                  <span className="category-label">{sound.category}</span>
                  <div className="pad-actions">
                    <a
                      className="download-button"
                      href={soundUrl(sound.file)}
                      download={sound.file}
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Download ${sound.name}`}
                      title={`Download ${sound.name}`}
                    >
                      <Download size={16} />
                    </a>
                    <button
                      className={`favorite ${favorites.includes(sound.id) ? 'selected' : ''}`}
                      onClick={(event) => { event.stopPropagation(); toggleFavorite(sound.id) }}
                      aria-label={`${favorites.includes(sound.id) ? 'Remove from' : 'Add to'} favorites`}
                    >
                      <Heart size={17} fill={favorites.includes(sound.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                <Waveform pattern={sound.pattern} />
                <div className="pad-bottom">
                  <h2>{sound.name}</h2>
                  <span className="play-dot">{playing === sound.id ? <Square size={9} fill="currentColor" /> : '▶'}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <AudioLines size={32} />
            <h2>No sounds found</h2>
            <p>Try another search or category.</p>
          </div>
        )}
      </section>

      <footer>
        <span>Soundwave / 2026</span>
        <span>Made for loud ideas.</span>
      </footer>
    </main>
  )
}

export default App
