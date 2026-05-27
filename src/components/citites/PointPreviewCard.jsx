import { Link } from "react-router-dom"

function PointPreviewCard({ point, isSelected = false, onSelect }) {
  return (
    <article className={isSelected ? "tarot-shell tarot-shell--selected" : "tarot-shell"}>
      <button type="button" onClick={onSelect} className="tarot-card" aria-pressed={isSelected}>
        <span className="sr-only">{isSelected ? `Nascondi ${point.name}` : `Rivela ${point.name}`}</span>

        <div className={isSelected ? "tarot-card__inner tarot-card__inner--flipped" : "tarot-card__inner"}>
          <div className="tarot-face tarot-face--back" aria-hidden="true">
            <div className="tarot-back" />
          </div>

          <div className="tarot-face tarot-face--front">
            <div className="tarot-front">
              <div className="tarot-front__media">
                {point.imageUrl ? <img src={point.imageUrl} alt={point.name} /> : <div className="tarot-front__placeholder">Immagine</div>}
              </div>

              <div className="pt-3">
                <h3 className="font-serif text-xl text-ink">{point.name}</h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{point.shortDescription}</p>

                {isSelected && point.primaryExperienceTitle && <p className="mt-3 text-sm leading-6 text-accent">{point.primaryExperienceTitle}</p>}

                {isSelected && point.primaryExperienceId ? (
                  <Link
                    to={`/experiences/${point.primaryExperienceId}`}
                    className="mt-4 inline-flex w-full justify-center rounded-full border border-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
                  >
                    Inizia esperienza
                  </Link>
                ) : (
                  isSelected && <p className="mt-4 text-sm text-accent">Nessuna esperienza disponibile</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </article>
  )
}

export default PointPreviewCard
