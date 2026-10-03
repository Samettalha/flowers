import FlowerPetals from './FlowerPetals.jsx'

const CX = 150
const CY = 130
const SOIL = 400

export default function Flower({ stage }) {
  const opening = stage === 'opening' || stage === 'bloomed'
  const cls = [
    'flower',
    opening ? 'opening' : '',
    stage === 'bloomed' ? 'bloomed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      <svg
        viewBox="0 0 300 440"
        className="flower-svg"
        role="img"
        aria-label="Açan bir çiçek"
      >
        <defs>
          <linearGradient id="g-stem" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4a6640" />
            <stop offset="60%" stopColor="#7a9463" />
            <stop offset="100%" stopColor="#a8bf91" />
          </linearGradient>

          <linearGradient id="g-leaf" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4a6640" />
            <stop offset="60%" stopColor="#7a9463" />
            <stop offset="100%" stopColor="#a8bf91" />
          </linearGradient>

          <linearGradient id="g-sepal" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#415a38" />
            <stop offset="100%" stopColor="#7a9463" />
          </linearGradient>

          <linearGradient id="g-bud" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#b06a78" />
            <stop offset="100%" stopColor="#e8b1ba" />
          </linearGradient>

          <radialGradient id="g-petal-outer" cx="0.5" cy="0.9" r="0.9">
            <stop offset="0%" stopColor="#9c4f5e" />
            <stop offset="55%" stopColor="#d3818e" />
            <stop offset="100%" stopColor="#f2c3c9" />
          </radialGradient>

          <radialGradient id="g-petal-mid" cx="0.5" cy="0.9" r="0.9">
            <stop offset="0%" stopColor="#b06a78" />
            <stop offset="55%" stopColor="#e5a1ac" />
            <stop offset="100%" stopColor="#f8d5da" />
          </radialGradient>

          <radialGradient id="g-petal-inner" cx="0.5" cy="0.9" r="0.9">
            <stop offset="0%" stopColor="#c98a94" />
            <stop offset="55%" stopColor="#f0bfc6" />
            <stop offset="100%" stopColor="#fce4e8" />
          </radialGradient>

          <radialGradient id="g-petal-core" cx="0.5" cy="0.9" r="0.9">
            <stop offset="0%" stopColor="#e2a9b1" />
            <stop offset="60%" stopColor="#f7d5da" />
            <stop offset="100%" stopColor="#fdeef0" />
          </radialGradient>

          <radialGradient id="g-center" cx="0.5" cy="0.4" r="0.65">
            <stop offset="0%" stopColor="#f8e8a8" />
            <stop offset="60%" stopColor="#d4a94e" />
            <stop offset="100%" stopColor="#8f6d28" />
          </radialGradient>

          <radialGradient id="g-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f7d5da" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#e8b1ba" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#e8b1ba" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r="150" fill="url(#g-halo)" className="halo" />

        <ellipse
          cx={CX}
          cy={SOIL + 6}
          rx="55"
          ry="6"
          fill="#c9b8a0"
          opacity="0.45"
          className="soil"
        />
        <ellipse
          cx={CX}
          cy={SOIL + 4}
          rx="34"
          ry="3"
          fill="#b09a82"
          opacity="0.4"
          className="soil"
        />

        <path
          className="stem"
          pathLength="1"
          d={`M ${CX} ${SOIL}
              C ${CX - 7} 320, ${CX + 9} 215, ${CX} ${CY + 20}`}
          fill="none"
          stroke="url(#g-stem)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <g className="leaf leaf-1">
          <path
            d={`M ${CX - 1} 340
                C ${CX - 32} 330, ${CX - 58} 300, ${CX - 62} 268
                C ${CX - 36} 280, ${CX - 12} 305, ${CX - 1} 340 Z`}
            fill="url(#g-leaf)"
          />
          <path
            d={`M ${CX - 3} 338 C ${CX - 26} 314, ${CX - 46} 292, ${CX - 56} 273`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="leaf leaf-2">
          <path
            d={`M ${CX + 1} 278
                C ${CX + 32} 268, ${CX + 58} 238, ${CX + 62} 206
                C ${CX + 36} 218, ${CX + 12} 243, ${CX + 1} 278 Z`}
            fill="url(#g-leaf)"
          />
          <path
            d={`M ${CX + 3} 276 C ${CX + 26} 252, ${CX + 46} 230, ${CX + 56} 211`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        <g className="bud-move">
          <g className="bud-scale">
            <path
              d={`M ${CX} ${CY + 30}
                  C ${CX - 20} ${CY + 20}, ${CX - 22} ${CY - 8}, ${CX - 6} ${CY - 18}
                  C ${CX - 3} ${CY - 2}, ${CX + 3} ${CY - 2}, ${CX + 6} ${CY - 18}
                  C ${CX + 22} ${CY - 8}, ${CX + 20} ${CY + 20}, ${CX} ${CY + 30} Z`}
              fill="url(#g-sepal)"
            />
            <path
              d={`M ${CX} ${CY + 14}
                  C ${CX - 16} ${CY + 4}, ${CX - 18} ${CY - 30}, ${CX} ${CY - 48}
                  C ${CX + 18} ${CY - 30}, ${CX + 16} ${CY + 4}, ${CX} ${CY + 14} Z`}
              fill="url(#g-bud)"
            />
            <path
              d={`M ${CX} ${CY - 42}
                  C ${CX - 8} ${CY - 20}, ${CX - 6} ${CY - 5}, ${CX} ${CY + 4}`}
              stroke="rgba(255, 220, 225, 0.45)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        <FlowerPetals cx={CX} cy={CY} />

        <g className="flower-heart">
          <g className="stamens">
            {Array.from({ length: 18 }).map((_, i) => {
              const a = (360 / 18) * i + 8
              const len = 14 + (i % 4) * 3
              const rad = (a * Math.PI) / 180
              const x2 = CX + Math.sin(rad) * len
              const y2 = CY - Math.cos(rad) * len
              return (
                <g
                  key={i}
                  className="stamen"
                  style={{ '--sd': `${i * 0.025}s` }}
                >
                  <line
                    x1={CX}
                    y1={CY}
                    x2={x2}
                    y2={y2}
                    stroke="#c9a250"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                  <circle cx={x2} cy={y2} r="1.5" fill="#f3d27a" />
                </g>
              )
            })}
          </g>
          <circle
            className="flower-center"
            cx={CX}
            cy={CY}
            r="9"
            fill="url(#g-center)"
          />
          <circle
            className="flower-center-hl"
            cx={CX - 2.5}
            cy={CY - 2.5}
            r="2.4"
            fill="#fff5d6"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  )
}