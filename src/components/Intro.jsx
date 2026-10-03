export default function Intro({ visible, onOpen }) {
  if (!visible) return null

  return (
    <button
      className="intro"
      onClick={onOpen}
      aria-label="Dokun ve çiçeği aç"
      type="button"
    >
      <p className="intro-text">Bir çiçek bırakmak istedim.</p>
      <span className="intro-tap">
        <span className="intro-tap-line" />
        <span className="intro-tap-text">Dokun ve aç</span>
      </span>
    </button>
  )
}