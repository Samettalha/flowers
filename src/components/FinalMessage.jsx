import { useEffect, useState } from 'react'

export default function FinalMessage({ signature = '— S.' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250)
    return () => clearTimeout(t)
  }, [])

  return (  
    <section className={`final-message ${visible ? 'is-visible' : ''}`}>
      <span className="final-line" />
      <p className="final-text">Umarım hayatın hep güzel çiçekler açtırır.</p>
      <p className="final-sign">{signature}</p>
    </section>
  )
}