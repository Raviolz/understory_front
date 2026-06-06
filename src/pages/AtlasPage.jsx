import { useEffect, useMemo, useState } from "react"
import { getMyAtlas } from "../api/meApi"
import AtlasFlipBook from "../components/journal/AtlasFlipBook"
import Loader from "../components/ui/Loader"
import ErrorLoader from "../components/ui/ErrorLoader"

function AtlasPage() {
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState(null)

  useEffect(() => {
    let ignore = false

    getMyAtlas({ size: 50 })
      .then((data) => {
        if (ignore) return

        setEntries(data.content ?? [])
        setPageError(null)
      })
      .catch((error) => {
        if (ignore) return

        console.error(error)
        setPageError("Impossibile caricare l'atlante.")
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

  const pageHeader = (
    <header className="atlas-page__header">
      <p className="atlas-page__eyebrow">Memorie ricostruite</p>

      <h1 className="atlas-page__title">Opera Omnia</h1>

      <p className="atlas-page__intro">Rileggi e sfoglia le storie che hai riportato alla luce.</p>
    </header>
  )

  return (
    <section className="atlas-page">
      <div className="atlas-page__panel">
        <div className="atlas-page__content">
          {pageHeader}

          {isLoading ? (
            <div className="atlas-page__state">
              <Loader label="Aprendo l'atlante…" />
            </div>
          ) : pageError ? (
            <div className="atlas-page__state">
              <ErrorLoader message={pageError} />
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
