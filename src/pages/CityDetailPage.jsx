import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPublishedCityById, getPublishedPointsByCity } from "../api/publicApi"
import PointPreviewCard from "../components/citites/PointPreviewCard"
import CityMap from "../components/citites/CityMap"

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
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <p className="text-muted">Caricamento città...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <p className="text-arcane">{error}</p>
      </main>
    )
  }

  if (!city) {
    return (
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <p className="text-muted">Città non trovata.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <Link to="/" className="text-sm text-muted hover:text-accent">
        ← Back to globe
      </Link>

      <section className="mt-10">
        <p className="text-sm uppercase tracking-[0.25em] text-accent">{city.country}</p>

        <h1 className="mt-4 font-serif text-4xl md:text-5xl">{city.name}</h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted md:text-base">{city.description}</p>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-3xl border border-border-soft bg-surface-soft/40 p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-accent">City map</p>

            <div className="mt-4">
              <CityMap city={city} points={points} selectedPoint={selectedPoint} onSelectPoint={handleSelectPoint} />
            </div>
          </div>
        </aside>

        <section>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent">La citta' ricorda piu' di quanto mostri</p>
              <h2 className="mt-3 font-serif text-3xl text-ink">Scegli la tua prossima carta</h2>
            </div>

            <p className="text-sm text-muted">{points.length} published points</p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

            {points.length === 0 && <p className="text-muted">Nessun point pubblicato per questa città.</p>}
          </div>
        </section>
      </section>
    </main>
  )
}

export default CityDetailPage
