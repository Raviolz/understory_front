import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPublishedCityById, getPublishedPointsByCity } from "../api/publicApi"
import PointPreviewCard from "../components/citites/PointPreviewCard"
import CityMap from "../components/citites/CityMap"
import Loader from "../components/ui/Loader"

function CityDetailPage() {
  const { cityId } = useParams()

  const [city, setCity] = useState(null)
  const [points, setPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [error, setError] = useState(null)

  const pointCardRefs = useRef({})

  function handleSelectPoint(point) {
    setSelectedPoint(point)

    requestAnimationFrame(() => {
      pointCardRefs.current[point.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    })
  }

  useEffect(() => {
    if (!cityId) return

    Promise.all([getPublishedCityById(cityId), getPublishedPointsByCity(cityId, { size: 50 })])
      .then(([cityData, pointsData]) => {
        const publishedPoints = pointsData.content ?? []

        setCity(cityData)
        setPoints(publishedPoints)
        setSelectedPoint(null)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setCity(null)
        setPoints([])
        setSelectedPoint(null)
        setError("Non riesco a caricare i dati della città.")
      })
  }, [cityId])

  if (!city && !error) {
    return (
      <section className="city-detail-page">
        <Loader label="Caricamento città…" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="city-detail-page">
        <p className="city-detail-message city-detail-message--error">{error}</p>
      </section>
    )
  }

  if (!city) {
    return (
      <section className="city-detail-page">
        <p className="city-detail-message">Città non trovata.</p>
      </section>
    )
  }

  return (
    <section className="city-detail-page">
      <div className="city-detail-panel">
        <Link to="/" className="city-detail-back">
          ← Back to globe
        </Link>

        <section className="city-detail-hero">
          <p className="city-detail-kicker">{city.country}</p>

          <h1 className="city-detail-title">{city.name}</h1>

          <p className="city-detail-description">{city.description}</p>
        </section>

        <section className="city-detail-layout">
          <aside className="city-detail-map-column">
            <div className="city-map-card">
              <span className="city-map-card__star" aria-hidden="true">
                ✦
              </span>
              <div className="city-map-card__header">
                <p className="city-map-card__title">City map</p>
              </div>

              <div className="city-map-card__ornament" aria-hidden="true" />

              <div className="city-map-card__frame">
                <CityMap city={city} points={points} selectedPoint={selectedPoint} onSelectPoint={handleSelectPoint} />
              </div>
            </div>
          </aside>

          <section className="city-detail-cards">
            <div className="city-detail-cards__header">
              <div>
                <p className="city-detail-kicker">La città ricorda più di quanto mostri</p>
                <h2 className="city-detail-section-title">Scegli la tua prossima carta</h2>
              </div>

              <p className="city-detail-count">{points.length} published points</p>
            </div>

            <div className="city-detail-grid">
              {points.map((point) => (
                <div
                  key={point.id}
                  ref={(element) => {
                    pointCardRefs.current[point.id] = element
                  }}
                >
                  <PointPreviewCard point={point} isSelected={selectedPoint?.id === point.id} onSelect={() => handleSelectPoint(point)} />
                </div>
              ))}

              {points.length === 0 && <p className="city-detail-message">Nessun point pubblicato per questa città.</p>}
            </div>
          </section>
        </section>
      </div>
    </section>
  )
}

export default CityDetailPage
