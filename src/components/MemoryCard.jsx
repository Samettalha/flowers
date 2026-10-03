export default function MemoryCard({ memory, index }) {
  return (
    <article className="memory-card" style={{ '--i': index }}>
      {memory.photo ? (
        <div className="memory-photo">
          <img
            src={memory.photo}
            alt={memory.title || 'Anı'}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="memory-photo memory-photo-placeholder"
          aria-hidden="true"
        >
          <span className="memory-photo-dot" />
        </div>
      )}

      <div className="memory-body">
        {memory.title && <h3 className="memory-title">{memory.title}</h3>}
        <p className="memory-text">{memory.text}</p>
      </div>
    </article>
  )
}