import { Link } from "react-router-dom"

function CityPreviewCard({ city, onClose }) {
  if (!city) return null

  return (
    <article className="relative w-full max-w-sm rounded-2xl border border-border-soft bg-surface/90 p-5 shadow-xl">
      <button type="button" onClick={onClose} aria-label="Close city preview" className="absolute right-4 top-4 text-muted transition hover:text-accent">
        ×
      </button>

      <p className="pr-8 text-xs uppercase tracking-[0.25em] text-accent">{city.country}</p>

      <h2 className="mt-3 pr-8 font-serif text-3xl text-ink">{city.name}</h2>

      <p className="mt-4 line-clamp-4 text-sm leading-7 text-muted">{city.description}</p>

      <Link
        to={`/cities/${city.id}`}
        className="mt-6 inline-flex rounded-full border border-accent-soft px-5 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
      >
        Explore city
      </Link>
    </article>
  )
}

export default CityPreviewCard
