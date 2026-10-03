import Flower from './Flower.jsx'
import Intro from './Intro.jsx'

export default function Garden({ stage, onOpen }) {
  const bloomed = stage === 'bloomed'

  return (
    <section className="garden">
      <div className="garden-flower">
        <Flower stage={stage} />
      </div>

      <Intro visible={stage === 'intro'} onOpen={onOpen} />

      {bloomed && (
        <div className="bloom-messages" aria-live="polite">
          <p className="bloom-msg bloom-msg-1">
            Bazı şeyler geri gelsin diye değil,
            <br />
            güzel kaldığı için hatırlanır.
          </p>
          <p className="bloom-msg bloom-msg-2">
            Bunu sadece yüzünü güldürsün diye bıraktım.
          </p>
          <p className="bloom-msg bloom-msg-3">Karşılığını beklemeden.</p>
        </div>
      )}
    </section>
  )
}