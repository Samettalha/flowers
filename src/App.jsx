import { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

/* ============================================================== */
/*  SABİTLER                                                       */
/* ============================================================== */

const CX = 200
const CY = 220        // çiçek merkezi (polenler burada)
const STEM_BASE = 800 // sapın topraktan çıktığı yer
const VIEW_H = 850

const STAGES = [
  { text: 'Toprak altında, sessizce.',  start: 0.03, end: 0.11 },
  { text: 'Kimse görmeden.',            start: 0.13, end: 0.20 },
  { text: 'Yavaşça yükselir.',          start: 0.22, end: 0.30 },
  { text: 'Işığa doğru uzanır.',        start: 0.32, end: 0.40 },
  { text: 'Bazen durur gibi olur.',     start: 0.42, end: 0.50 },
  { text: 'Ama durmaz.',                start: 0.52, end: 0.60 },
  { text: 'Kendi zamanını bekler.',     start: 0.62, end: 0.70 },
  { text: 'Sen de bekle.',              start: 0.72, end: 0.80 },
  { text: 'İşte o an.',                 start: 0.82, end: 0.90 },
  { text: 'Bu senin için.',             start: 0.92, end: 2.00 },
]

const MEMORY_LINES = [
  'Birlikte güldüğümüz saçma şeyler.',
  'Kimsenin önemsemeyeceği ama benim hatırladığım küçük anlar.',
  'Bazı konuşmaların saatlerce sürmesi.',
  'Yan yana sessiz kalmanın bile güzel olması.',
]

/*
  İçten dışa 6 katman.
  İç katman (li=5) → start 0.56
  Dış katman (li=0) → start 0.86
*/
const ROSE_LAYERS = [
  { count: 8, len: 132, w: 100, offset: 0,   start: 0.86, end: 0.98, fill: 'url(#petalOuter)' },
  { count: 7, len: 106, w: 82,  offset: 25,  start: 0.80, end: 0.94, fill: 'url(#petalMid)'   },
  { count: 6, len: 82,  w: 64,  offset: 0,   start: 0.74, end: 0.88, fill: 'url(#petalMid)'   },
  { count: 5, len: 60,  w: 48,  offset: 36,  start: 0.68, end: 0.82, fill: 'url(#petalInner)' },
  { count: 4, len: 42,  w: 32,  offset: 45,  start: 0.62, end: 0.76, fill: 'url(#petalInner)' },
  { count: 3, len: 26,  w: 22,  offset: 0,   start: 0.56, end: 0.70, fill: '#ffffff'          },
]

/* ============================================================== */
/*  PETAL ŞEKLİ — (0,0)'dan yukarı uzanan simetrik teardrop         */
/*  Rotasyon uygulanınca dört bir yana yayılır.                     */
/* ============================================================== */

function petalShape(len, w) {
  return `
    M 0 0
    C ${-w * 0.7} ${-len * 0.15}, ${-w * 1.0} ${-len * 0.50}, ${-w * 0.9} ${-len * 0.75}
    C ${-w * 0.7} ${-len * 0.95}, ${-w * 0.30} ${-len},    0 ${-len}
    C ${w * 0.30} ${-len},        ${w * 0.7} ${-len * 0.95}, ${w * 0.9} ${-len * 0.75}
    C ${w * 1.0} ${-len * 0.50}, ${w * 0.7} ${-len * 0.15},  0 0
    Z
  `.trim()
}

/* ============================================================== */
/*  APP                                                            */
/* ============================================================== */

export default function App() {
  const journeyRef = useRef(null)

  const rawProgress = useMotionValue(0)
  const progress = useSpring(rawProgress, {
    stiffness: 55,
    damping: 22,
    mass: 0.7,
  })

  useEffect(() => {
    const journey = journeyRef.current
    if (!journey) return

    const clamp = (v) => Math.max(0, Math.min(1, v))
    const WHEEL_SPEED = 0.00055
    const TOUCH_SPEED = 0.0017
    const WHEEL_MAX   = 90

    const isActive = () => {
      const rect = journey.getBoundingClientRect()
      return rect.top <= 1 && rect.bottom >= window.innerHeight - 1
    }

    const onWheel = (e) => {
      if (!isActive()) return
      const p = rawProgress.get()
      const delta = Math.max(-WHEEL_MAX, Math.min(WHEEL_MAX, e.deltaY))
      if (delta > 0 && p < 1) {
        e.preventDefault()
        rawProgress.set(clamp(p + delta * WHEEL_SPEED))
      } else if (delta < 0 && p > 0) {
        e.preventDefault()
        rawProgress.set(clamp(p + delta * WHEEL_SPEED))
      }
    }

    let lastY = null
    const onTouchStart = (e) => { lastY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (lastY === null) return
      if (!isActive()) { lastY = e.touches[0].clientY; return }
      const y = e.touches[0].clientY
      const delta = lastY - y
      lastY = y
      const p = rawProgress.get()
      if (delta > 0 && p < 1) {
        e.preventDefault()
        rawProgress.set(clamp(p + delta * TOUCH_SPEED))
      } else if (delta < 0 && p > 0) {
        e.preventDefault()
        rawProgress.set(clamp(p + delta * TOUCH_SPEED))
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [rawProgress])

  return (
    <div className="app">
      <LightBeams />
      <ParticleField />

      <section ref={journeyRef} className="journey">
        <div className="sticky">
          <Vignette progress={progress} />
          <Flower progress={progress} />
          <Intro progress={progress} />
          <StageMessages progress={progress} />
        </div>
      </section>

      <Memories />
      <Finale />
    </div>
  )
}

/* ============================================================== */
/*  ATMOSFER                                                       */
/* ============================================================== */

function LightBeams() {
  return (
    <>
      <div className="light-beam" aria-hidden="true" />
      <div className="light-beam light-beam-2" aria-hidden="true" />
    </>
  )
}

function ParticleField() {
  const particles = Array.from({ length: 32 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 1.5 + Math.random() * 3,
    dur: 10 + Math.random() * 14,
    delay: -Math.random() * 16,
    drift: (Math.random() - 0.5) * 60,
  }))
  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function Vignette({ progress }) {
  const opacity = useTransform(progress, [0.5, 1], [0, 0.42], { clamp: true })
  return <motion.div className="vignette" style={{ opacity }} aria-hidden="true" />
}

/* ============================================================== */
/*  ÇİÇEK                                                          */
/* ============================================================== */

function Flower({ progress }) {
  const soilOpacity = useTransform(progress, [0.02, 0.08], [0, 1], { clamp: true })

  const stemScaleY  = useTransform(progress, [0.06, 0.32], [0, 1], { clamp: true })
  const stemOpacity = useTransform(progress, [0.06, 0.10], [0, 1], { clamp: true })

  const leaf1Scale   = useTransform(progress, [0.26, 0.40], [0.05, 1], { clamp: true })
  const leaf1Opacity = useTransform(progress, [0.26, 0.32], [0, 1], { clamp: true })
  const leaf2Scale   = useTransform(progress, [0.36, 0.50], [0.05, 1], { clamp: true })
  const leaf2Opacity = useTransform(progress, [0.36, 0.42], [0, 1], { clamp: true })

  const haloOpacity = useTransform(progress, [0.86, 1.0], [0, 1], { clamp: true })
  const haloScale   = useTransform(progress, [0.86, 1.0], [0.65, 1.05], { clamp: true })

  return (
    <div className="flower-stage">
      <svg
        viewBox={`0 0 400 ${VIEW_H}`}
        className="flower-svg"
        role="img"
        aria-label="Açan beyaz bir gül"
      >
        <defs>
          <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#3a5330" />
            <stop offset="55%"  stopColor="#65804f" />
            <stop offset="100%" stopColor="#93ab7c" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#2f4626" />
            <stop offset="55%"  stopColor="#5f7a4a" />
            <stop offset="100%" stopColor="#a4bc8c" />
          </linearGradient>

          <radialGradient id="haloGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#f8ead0" stopOpacity="0.60" />
            <stop offset="50%"  stopColor="#f0dcc0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#e8ccb0" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="soilGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#a89078" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a89078" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="petalOuter" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="65%"  stopColor="#fdfaf2" />
            <stop offset="100%" stopColor="#efdfc0" />
          </linearGradient>
          <linearGradient id="petalMid" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="70%"  stopColor="#fefbf4" />
            <stop offset="100%" stopColor="#f5e9d2" />
          </linearGradient>
          <linearGradient id="petalInner" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fbf5e8" />
          </linearGradient>

          <radialGradient id="pollenGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"   stopColor="#fff8d0" stopOpacity="0.95" />
            <stop offset="55%"  stopColor="#f5c518" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5c518" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Arka halo */}
        <motion.circle
          cx={CX} cy={CY} r={240}
          fill="url(#haloGrad)"
          style={{
            opacity: haloOpacity,
            scale: haloScale,
            transformOrigin: `${CX}px ${CY}px`,
            transformBox: 'view-box',
          }}
        />

        {/* Toprak */}
        <motion.ellipse
          cx={CX} cy={STEM_BASE + 10}
          rx={100} ry={18}
          fill="url(#soilGrad)"
          style={{ opacity: soilOpacity }}
        />

        {/* Uzun sap */}
        <motion.g
          style={{
            scaleY: stemScaleY,
            opacity: stemOpacity,
            transformOrigin: `${CX}px ${STEM_BASE}px`,
            transformBox: 'view-box',
          }}
        >
          <path
            d={`M ${CX} ${STEM_BASE}
                C ${CX - 12} 700, ${CX + 14} 560, ${CX + 6} 430
                C ${CX - 2} 340, ${CX - 6} 280, ${CX} ${CY}`}
            fill="none"
            stroke="url(#stemGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${CX - 2} ${STEM_BASE - 10}
                C ${CX - 12} 700, ${CX + 10} 560, ${CX + 2} 430
                C ${CX - 6} 340, ${CX - 8} 280, ${CX - 2} ${CY}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Yaprak 1 — sol alt */}
        <motion.g
          style={{
            scale: leaf1Scale,
            opacity: leaf1Opacity,
            transformOrigin: '192px 600px',
            transformBox: 'view-box',
          }}
        >
          <path
            d={`M 192 600
                C 140 590, 78 535, 58 460
                C 112 476, 168 530, 192 600 Z`}
            fill="url(#leafGrad)"
            stroke="rgba(45, 65, 35, 0.28)"
            strokeWidth="0.8"
          />
          <path
            d={`M 190 598 C 156 558, 110 512, 70 475`}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Yaprak 2 — sağ orta */}
        <motion.g
          style={{
            scale: leaf2Scale,
            opacity: leaf2Opacity,
            transformOrigin: '208px 450px',
            transformBox: 'view-box',
          }}
        >
          <path
            d={`M 208 450
                C 262 438, 322 382, 340 306
                C 286 322, 228 378, 208 450 Z`}
            fill="url(#leafGrad)"
            stroke="rgba(45, 65, 35, 0.28)"
            strokeWidth="0.8"
          />
          <path
            d={`M 210 448 C 244 408, 288 362, 332 322`}
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
        </motion.g>

        {/* GÜL — petaller (içten dışa) */}
        <Rose progress={progress} />

        {/* SARI POLEN MERKEZİ — en üstte, hep görünür */}
        <PollenCenter progress={progress} />
      </svg>
    </div>
  )
}

/* ============================================================== */
/*  ROSE                                                           */
/* ============================================================== */

function Rose({ progress }) {
  return (
    <g>
      {ROSE_LAYERS.map((layer, li) => (
        <g key={li}>
          {Array.from({ length: layer.count }).map((_, i) => {
            const angle = (360 / layer.count) * i + layer.offset
            const staggerT = layer.count > 1 ? i / (layer.count - 1) : 0
            const start = layer.start + staggerT * 0.03
            const end   = layer.end   + staggerT * 0.03

            return (
              <Petal
                key={i}
                progress={progress}
                angle={angle}
                length={layer.len}
                width={layer.w}
                start={start}
                end={end}
                fill={layer.fill}
              />
            )
          })}
        </g>
      ))}
    </g>
  )
}

function Petal({ progress, angle, length, width, start, end, fill }) {
  const scale   = useTransform(progress, [start, end], [0.15, 1], { clamp: true })
  const opacity = useTransform(progress, [start, start + 0.04], [0, 1], { clamp: true })

  const d = petalShape(length, width)

  return (
    /* DIŞ GRUP: statik SVG rotate — petali (CX,CY) etrafında döndürür
       → bu sayede petaller dört bir yana yayılır. */
    <g transform={`rotate(${angle} ${CX} ${CY})`}>
      {/* İÇ GRUP: sadece motion scale + opacity */}
      <motion.g
        style={{
          scale,
          opacity,
          transformOrigin: `${CX}px ${CY}px`,
          transformBox: 'view-box',
        }}
      >
        <g transform={`translate(${CX} ${CY})`}>
          <path
            d={d}
            fill={fill}
            stroke="rgba(186, 160, 122, 0.42)"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
        </g>
      </motion.g>
    </g>
  )
}

/* ============================================================== */
/*  POLLEN CENTER — büyük, ortada, en üstte                         */
/* ============================================================== */

function PollenCenter({ progress }) {
  // İç yapraklardan biraz önce başlasın
  const opacity = useTransform(progress, [0.50, 0.60], [0, 1], { clamp: true })
  const scale   = useTransform(progress, [0.50, 0.72], [0.3, 1], { clamp: true })

  const stamens = Array.from({ length: 16 }).map((_, i) => {
    const angle = (360 / 16) * i + 11
    const len   = 12 + (i % 5) * 2.4   // 12 - 21.6
    const rad   = (angle * Math.PI) / 180
    const x     = Math.sin(rad) * len
    const y     = -Math.cos(rad) * len
    return { x, y, i }
  })

  return (
    <motion.g
      style={{
        opacity,
        scale,
        transformOrigin: `${CX}px ${CY}px`,
        transformBox: 'view-box',
      }}
    >
      <g transform={`translate(${CX} ${CY})`}>
        {/* Geniş sarı ışıma */}
        <circle r="30" fill="url(#pollenGlow)" />

        {/* Stamen çizgileri + polen başları */}
        {stamens.map((s, i) => (
          <g key={i}>
            <line
              x1="0" y1="0"
              x2={s.x} y2={s.y}
              stroke="#c99b2e"
              strokeWidth="0.95"
              strokeLinecap="round"
            />
            <circle cx={s.x} cy={s.y} r="2.3" fill="#e8b525" />
            <circle cx={s.x} cy={s.y} r="1.6" fill="#f5c518" />
            <circle cx={s.x - 0.5} cy={s.y - 0.6} r="0.7" fill="#fff8d0" />
          </g>
        ))}

        {/* Merkez sarı küme */}
        <circle r="5.5" fill="#e8b525" />
        <circle r="3.8" fill="#f5c518" />
        <circle cx="-1" cy="-1.2" r="1.4" fill="#fff8d0" />
      </g>
    </motion.g>
  )
}

/* ============================================================== */
/*  INTRO                                                          */
/* ============================================================== */

function Intro({ progress }) {
  const opacity    = useTransform(progress, [0, 0.06], [1, 0], { clamp: true })
  const y          = useTransform(progress, [0, 0.09], [0, -60], { clamp: true })
  const cueOpacity = useTransform(progress, [0.02, 0.06], [1, 0], { clamp: true })

  return (
    <motion.div className="intro-layer" style={{ opacity }} aria-hidden="true">
      <motion.span className="intro-eyebrow" style={{ y }}>
        <span className="intro-line" />
        senin için
        <span className="intro-line" />
      </motion.span>

      <motion.h1 className="intro-title" style={{ y }}>
        Bazı güzel şeyler
        <br />
        <em>aceleye gelmez.</em>
      </motion.h1>

      <motion.div className="scroll-cue" style={{ opacity: cueOpacity }}>
        <span className="scroll-cue-text">kaydır</span>
        <span className="scroll-cue-line" />
      </motion.div>
    </motion.div>
  )
}

/* ============================================================== */
/*  SAHNE MESAJLARI                                                */
/* ============================================================== */

function StageMessages({ progress }) {
  return (
    <div className="stages" aria-live="polite">
      {STAGES.map((s, i) => (
        <StageText key={i} progress={progress} start={s.start} end={s.end}>
          {s.text}
        </StageText>
      ))}
    </div>
  )
}

function StageText({ progress, start, end, children }) {
  const span = end - start
  const inEnd = start + span * 0.25
  const outStart = end - span * 0.25

  const opacity = useTransform(
    progress,
    [start, inEnd, outStart, end],
    [0, 1, 1, 0],
    { clamp: true }
  )
  const y = useTransform(progress, [start, end], [14, -14], { clamp: true })

  return (
    <motion.p className="stage-text" style={{ opacity, y }}>
      {children}
    </motion.p>
  )
}

/* ============================================================== */
/*  ANILAR                                                         */
/* ============================================================== */

function Memories() {
  return (
    <section className="memories">
      <motion.header
        className="memories-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="memories-line" />
        <h2 className="memories-title">Bazı şeyler küçükken güzeldi.</h2>
        <span className="memories-line" />
      </motion.header>

      <ul className="memory-list">
        {MEMORY_LINES.map((line, i) => (
          <motion.li
            key={i}
            className="memory-line"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{
              duration: 1.2,
              delay: i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span className="memory-dot" />
            <span className="memory-text">{line}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* ============================================================== */
/*  FİNAL                                                          */
/* ============================================================== */

function Finale() {
  return (
    <section className="finale">
      <motion.div
        className="finale-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="finale-line" />
        <p className="finale-text">
          Umarım hayatın hep
          <br />
          güzel çiçekler açtırır.
        </p>
        <p className="finale-sign">senin için</p>
      </motion.div>
    </section>
  )
}