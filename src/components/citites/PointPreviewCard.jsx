import { Link } from "react-router-dom"

function PointPreviewCard({ point, isSelected = false, onSelect }) {
  return (
    <article className={isSelected ? "tarot-shell tarot-shell--selected" : "tarot-shell"}>
      <div className="tarot-card">
        <div className={isSelected ? "tarot-card__inner tarot-card__inner--flipped" : "tarot-card__inner"}>
          <div className="tarot-face tarot-face--back" aria-hidden={isSelected}>
            <button type="button" onClick={onSelect} className="tarot-card__reveal-button" aria-label={`Rivela ${point.name}`}>
              <div className="tarot-back" />
            </button>
          </div>

          <div className="tarot-face tarot-face--front" aria-hidden={!isSelected}>
            <div className="tarot-front">
              <div className="tarot-front__media">
                {point.imageUrl ? <img src={point.imageUrl} alt={point.name} /> : <div className="tarot-front__placeholder">Immagine</div>}
              </div>

              <div className="tarot-front__body">
                <h3 className="tarot-front__title">{point.name}</h3>

                <p className="tarot-front__text">{point.shortDescription}</p>

                {point.primaryExperienceTitle && <p className="tarot-front__experience">{point.primaryExperienceTitle}</p>}

                {point.primaryExperienceId ? (
                  <Link to={`/experiences/${point.primaryExperienceId}`} className="tarot-front__action">
                    Inizia esperienza <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <p className="tarot-front__empty">Nessuna esperienza disponibile</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PointPreviewCard
