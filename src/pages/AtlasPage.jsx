import { useEffect, useMemo, useState } from "react"
import backgroundAtlas from "../assets/atlas/backgroundAtlas.png"
import { getMyAtlas } from "../api/meApi"
import AtlasFlipBook from "../components/journal/AtlasFlipBook"
import Loader from "../components/ui/Loader"

function AtlasPage() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    getMyAtlas({ size: 50 })
    getMyAtlas({ size: 50 })
      .then((data) => {
        if (ignore) return

        console.log("ATLAS DATA", data.content)

        setEntries(data.content ?? [])
        setError(null)
      })
      .catch((error) => {
        if (ignore) return

        console.error(error)
        setError("Non riesco a caricare l'atlante.")
      })
      .finally(() => {
        if (ignore) return

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const sortedEntries = useMemo(() => {
    return [...entries].sort((firstEntry, secondEntry) => {
      return new Date(secondEntry.completedAt) - new Date(firstEntry.completedAt)
    })
  }, [entries])

  return (
    <section className="atlas-page">
      <div className="atlas-page__panel">
        <img src={backgroundAtlas} alt="" aria-hidden="true" className="atlas-page__background" />

        <div className="atlas-page__content">
          <header className="atlas-page__header">
            <p className="atlas-page__kicker">UNDERSTORY ARCHIVES</p>
            <h1 className="atlas-page__title">Atlante</h1>
            <p className="atlas-page__intro">Rileggi le esperienze raccolte lungo il percorso.</p>
          </header>

          {isLoading ? (
            <div className="atlas-page__state">
              <Loader label="Caricamento atlante…" />
            </div>
          ) : error ? (
            <div className="atlas-page__state">
              <p className="text-arcane">{error}</p>
            </div>
          ) : (
            <AtlasFlipBook entries={sortedEntries} />
          )}
        </div>
      </div>
    </section>
  )
}

export default AtlasPage
