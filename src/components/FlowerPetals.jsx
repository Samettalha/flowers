const LAYERS = [
  { count: 14, len: 118, w: 32, offset: 0,  hue: 'outer', delay: 0.0 },
  { count: 12, len: 98,  w: 27, offset: 15, hue: 'mid',   delay: 0.25 },
  { count: 10, len: 78,  w: 22, offset: 30, hue: 'inner', delay: 0.5 },
  { count: 8,  len: 58,  w: 17, offset: 45, hue: 'core',  delay: 0.75 },
]

const FILLS = {
  outer: 'url(#g-petal-outer)',
  mid: 'url(#g-petal-mid)',
  inner: 'url(#g-petal-inner)',
  core: 'url(#g-petal-core)',
}

function petalPath(cx, cy, len, w) {
  const t = (f) => cy - len * f
  return [
    `M ${cx} ${cy}`,
    `C ${cx - w * 0.9} ${t(0.1)}, ${cx - w * 1.0} ${t(0.5)}, ${cx - w * 0.5} ${t(0.8)}`,
    `C ${cx - w * 0.25} ${t(0.93)}, ${cx - w * 0.08} ${t(1.0)}, ${cx} ${t(1.0)}`,
    `C ${cx + w * 0.08} ${t(1.0)}, ${cx + w * 0.25} ${t(0.93)}, ${cx + w * 0.5} ${t(0.8)}`,
    `C ${cx + w * 1.0} ${t(0.5)}, ${cx + w * 0.9} ${t(0.1)}, ${cx} ${cy}`,
    'Z',
  ].join(' ')
}

function petalVeins(cx, cy, len) {
  return [
    `M ${cx} ${cy - len * 0.08} Q ${cx} ${cy - len * 0.5} ${cx} ${cy - len * 0.9}`,
    `M ${cx - 1.2} ${cy - len * 0.2} Q ${cx - 4} ${cy - len * 0.5} ${cx - 3} ${cy - len * 0.75}`,
    `M ${cx + 1.2} ${cy - len * 0.2} Q ${cx + 4} ${cy - len * 0.5} ${cx + 3} ${cy - len * 0.75}`,
  ]
}

export default function FlowerPetals({ cx, cy }) {
  return (
    <g className="petals">
      {LAYERS.map((layer, li) => (
        <g key={li} className={`petal-layer petal-${layer.hue}`}>
          {Array.from({ length: layer.count }).map((_, i) => {
            const baseAngle = (360 / layer.count) * i + layer.offset
            const jitter = (((i * 7) % 5) - 2) * 0.9
            const angle = baseAngle + jitter
            const sizeVar = 0.94 + ((i * 11) % 7) * 0.02
            const delay = layer.delay + (i / layer.count) * 0.55

            return (
              <g
                key={i}
                className="petal"
                style={{
                  '--angle': `${angle}deg`,
                  '--delay': `${delay}s`,
                  '--scale': sizeVar,
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              >
                <path
                  d={petalPath(cx, cy, layer.len * sizeVar, layer.w)}
                  fill={FILLS[layer.hue]}
                  stroke="rgba(120, 50, 60, 0.08)"
                  strokeWidth="0.5"
                />
                {petalVeins(cx, cy, layer.len * sizeVar).map((v, k) => (
                  <path
                    key={k}
                    d={v}
                    stroke="rgba(120, 40, 55, 0.18)"
                    strokeWidth="0.6"
                    fill="none"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            )
          })}
        </g>
      ))}
    </g>
  )
}