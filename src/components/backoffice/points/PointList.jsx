import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BackofficePagination from "../BackofficePagination"
import { deleteBackofficePoint, getBackofficePoints, publishBackofficePoint, unpublishBackofficePoint } from "../../../api/backofficeApi"

const PAGE_SIZE = 15

function PointList() {
  const [points, setPoints] = useState([])
  const [pageData, setPageData] = useState(null)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  function handlePageChange(nextPage) {
    if (nextPage === page) {
      return
    }

    setIsLoading(true)
    setError(null)
    setPage(nextPage)
  }

  function handlePublish(pointId) {
    publishBackofficePoint(pointId)
      .then((updatedPoint) => {
        setPoints((currentPoints) => currentPoints.map((point) => (point.id === updatedPoint.id ? updatedPoint : point)))
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a pubblicare il punto di interesse.")
      })
  }

  function handleUnpublish(pointId) {
    unpublishBackofficePoint(pointId)
      .then((updatedPoint) => {
        setPoints((currentPoints) => currentPoints.map((point) => (point.id === updatedPoint.id ? updatedPoint : point)))
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a rimettere il punto di interesse in bozza.")
      })
  }

  function handleDelete(pointId) {
    const confirmed = window.confirm("Eliminare definitivamente questo punto di interesse?")

    if (!confirmed) return

    setError(null)

    deleteBackofficePoint(pointId)
      .then(() => {
        setPoints((currentPoints) => currentPoints.filter((point) => point.id !== pointId))
      })
      .catch((error) => {
        console.error(error)
        setError("Non puoi eliminare questo punto di interesse perché ha esperienze collegate. Rimuovi o sposta prima le esperienze oppure usa Unpublish.")
      })
  }

  useEffect(() => {
    let ignore = false

    getBackofficePoints({ page, size: PAGE_SIZE })
      .then((data) => {
        if (ignore) {
          return
        }

        setPageData(data)
        setPoints(data.content || [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Non riesco a caricare i punti di interesse.")
      })
      .finally(() => {
        if (ignore) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page])

  if (isLoading) {
    return <p className="text-muted">Caricamento punti di interesse...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <Link to="/backoffice" className="text-sm text-muted hover:text-accent">
        ← Backoffice
      </Link>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Points of Interest</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci i luoghi fisici collegati alle città dell'archivio.</p>
        </div>

        <Link
          to="/backoffice/points/new"
          className="inline-flex rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Create point
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">City</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Coordinates</th>
              <th className="w-[180px] px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {points.map((point) => (
              <tr key={point.id} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{point.name}</td>

                <td className="px-4 py-4 text-muted">{point.cityName}</td>

                <td className="w-[180px] px-4 py-4">
                  <span className={point.active ? "text-accent" : "text-muted"}>{point.active ? "Published" : "Draft"}</span>
                </td>

                <td className="px-4 py-4 text-muted">
                  {point.latitude}, {point.longitude}
                </td>

                <td className="px-4 py-4">
                  <div className="bo-actions">
                    <Link to={`/backoffice/points/${point.id}/edit`} className="bo-action bo-action--edit" title="Edit" aria-label="Edit point">
                      ✎
                    </Link>

                    {point.active ? (
                      <button
                        type="button"
                        onClick={() => handleUnpublish(point.id)}
                        className="bo-action bo-action--publish"
                        title="Unpublish"
                        aria-label="Unpublish point"
                      >
                        ↓
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePublish(point.id)}
                        className="bo-action bo-action--publish"
                        title="Publish"
                        aria-label="Publish point"
                      >
                        ↑
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(point.id)}
                      className="bo-action bo-action--delete"
                      title="Delete"
                      aria-label="Delete point"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {points.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted">
                  Nessun punto di interesse presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BackofficePagination pageData={pageData} onPageChange={handlePageChange} />
    </section>
  )
}

export default PointList
