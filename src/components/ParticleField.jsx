import { useMemo } from 'react'

export default function ParticleField({ bloomed }) {
  const particles = useMemo(() => {
    const list = []
    const COUNT = 28
    for (let i = 0; i < COUNT; i++) {
      list.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3,
        dur: 9 + Math.random() * 10,
        delay: -Math.random() * 12,
        drift: (Math.random() - 0.5) * 40,
      })
    }
    return list
  }, [])

  return (
    <div
      className={`particle-field ${bloomed ? 'bloomed' : ''}`}
      aria-hidden="true"
    >   
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