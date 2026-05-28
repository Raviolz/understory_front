import { Link } from "react-router-dom"

function CityPreviewCard({ city, onClose }) {
  const hasCoords = city.latitude != null && city.longitude != null

  return (
    <article className="city-preview-card">
      <button type="button" onClick={onClose} className="city-preview-card__close" aria-label="Chiudi anteprima">
        ×
      </button>

      <p className="city-preview-card__country">{city.country}</p>

      <h2 className="city-preview-card__title">{city.name}</h2>

      {hasCoords && (
        <>
          <div className="city-preview-card__rule" />

          <p className="city-preview-card__coords">
            {city.latitude}, {city.longitude}
          </p>
        </>
      )}

      <p className="city-preview-card__desc">{city.description}</p>

      <Link to={`/cities/${city.id}`} className="city-preview-card__action">
        Entra in città
      </Link>
    </article>
  )
}

export default CityPreviewCard
