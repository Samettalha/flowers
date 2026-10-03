import { useEffect, useRef } from 'react'

export default function MusicControl({ visible, on, onToggle }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current
    audio.volume = 0.28

    if (on) {
      const p = audio.play()
      if (p && p.catch) p.catch(() => {})
    } else {
      audio.pause()
    }
  }, [on])

  if (!visible) return null

  return (
    <>
      <audio
        ref={audioRef}
        src="/ambient.mp3"
        loop
        preload="none"
        aria-hidden="true"
      />

      <button
        type="button"
        className={`music-control ${on ? 'is-on' : ''}`}
        onClick={onToggle}
        aria-label={on ? 'Sesi kapat' : 'Sesi aç'}
      >
        <span className="music-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="music-label">
          {on ? 'ses açık' : 'ses kapalı'}
        </span>
      </button>
    </>
  )
}