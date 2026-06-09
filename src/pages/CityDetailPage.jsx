import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { getPublishedCityById, getPublishedPointsByCity } from "../api/publicApi"
import PointPreviewCard from "../components/citites/PointPreviewCard"
import CityMap from "../components/citites/CityMap"
import Loader from "../components/ui/Loader"
import ErrorLoader from "../components/ui/ErrorLoader"

const mapLegendItems = [
  {
    code: "ALL",
    label: "TUTTE LE TRACCE",
    color: "#d4a359",
  },
  {
    code: "BURIED_FOLKLORE",
    label: "BURIED FOLKLORE",
    color: "#0D9488",
  },
  {
    code: "HIDDEN_HISTORY",
    label: "HIDDEN HISTORY",
    color: "#d4a359",
  },
  {
    code: "URBAN_MYSTERY",
    label: "URBAN MYSTERY",
    color: "#a855f7",
  },
]

function getPointCategoryCode(point) {
  return point.primaryExperienceCategoryCode || null
}

function CityDetailPage() {
  const { cityId } = useParams()

  const [city, setCity] = useState(null)
  const [points, setPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [activeCategory, setActiveCategory] = useState("ALL")
  const [error, setError] = useState(null)
  const [isLegendOpen, setIsLegendOpen] = useState(false)

  const pointCardRefs = useRef({})

  const filteredPoints = useMemo(() => {
    if (activeCategory === "ALL") {
      return points
    }

    return points.filter((point) => getPointCategoryCode(point) === activeCategory)
  }, [points, activeCategory])

  function handleSelectPoint(point) {
    setSelectedPoint(point)

    requestAnimationFrame(() => {
      pointCardRefs.current[point.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    })
  }

  function handleSelectCategory(categoryCode) {
    setActiveCategory(categoryCode)

    setSelectedPoint((currentPoint) => {
      if (!currentPoint) return null
      if (categoryCode === "ALL") return currentPoint

      const currentPointCategory = getPointCategoryCode(currentPoint)

      return currentPointCategory === categoryCode ? currentPoint : null
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
        setActiveCategory("ALL")
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setCity(null)
        setPoints([])
        setSelectedPoint(null)
        setActiveCategory("ALL")
        setError("Impossibile caricare la città e i suoi luoghi.")
      })
  }, [cityId])

  if (!city && !error) {
    return (
      <section className="city-detail-page">
        <div className="city-detail-panel">
          <div className="city-detail-state">
            <Loader label="Caricamento città…" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="city-detail-page">
        <div className="city-detail-panel">
          <div className="city-detail-state">
            <ErrorLoader message={error} />
          </div>
        </div>
      </section>
    )
  }

  if (!city) {
    return (
      <section className="city-detail-page">
        <div className="city-detail-panel">
          <p className="city-detail-message">Città non trovata.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="city-detail-page">
      <div className="city-detail-panel">
        <section className="city-detail-hero">
          <p className="city-detail-eyebrow">{city.country}</p>

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
                <CityMap city={city} points={filteredPoints} selectedPoint={selectedPoint} onSelectPoint={handleSelectPoint} />
              </div>

              <div className="city-map-legend">
                <button
                  type="button"
                  className="city-map-legend__toggle"
                  onClick={() => setIsLegendOpen((currentValue) => !currentValue)}
                  aria-expanded={isLegendOpen}
                >
                  Legenda/Filtri {isLegendOpen ? "↑" : "↓"}
                </button>

                {isLegendOpen && (
                  <ul className="city-map-legend__list" aria-label="Legenda categorie esperienze">
                    {mapLegendItems.map((item) => {
                      const isActive = activeCategory === item.code

                      return (
                        <li key={item.code} className="city-map-legend__item">
                          <button
                            type="button"
                            onClick={() => handleSelectCategory(item.code)}
                            className={isActive ? "city-map-legend__button city-map-legend__button--active" : "city-map-legend__button"}
                          >
                            <span className="city-map-legend__dot" style={{ "--legend-color": item.color }} aria-hidden="true" />
                            <span className="city-map-legend__label uppercase">{item.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </aside>

          <section className="city-detail-cards">
            <div className="city-detail-cards__header">
              <div>
                <p className="city-detail-eyebrow">La città ricorda più di quanto mostri</p>
                <h2 className="city-detail-section-title">Scegli la tua prossima carta</h2>
              </div>
            </div>

            <div className="city-detail-grid">
              {filteredPoints.map((point) => (
                <div
                  key={point.id}
                  ref={(element) => {
                    pointCardRefs.current[point.id] = element
                  }}
                >
                  <PointPreviewCard point={point} isSelected={selectedPoint?.id === point.id} onSelect={() => handleSelectPoint(point)} />
                </div>
              ))}

              {points.length === 0 && <p className="city-detail-message">Nessun luogo pubblicato per questa città.</p>}

              {points.length > 0 && filteredPoints.length === 0 && <p className="city-detail-message">Nessuna carta trovata per questa categoria.</p>}
            </div>
          </section>
        </section>
      </div>
    </section>
  )
}

export default CityDetailPage
