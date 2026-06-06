import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BackofficePagination from "../BackofficePagination"
import {
  deleteBackofficeLocalBusiness,
  getBackofficeLocalBusinesses,
  publishBackofficeLocalBusiness,
  unpublishBackofficeLocalBusiness,
} from "../../../api/backofficeApi"

const PAGE_SIZE = 15

function LocalBusinessList() {
  const [businesses, setBusinesses] = useState([])
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

  function handlePublish(businessId) {
    publishBackofficeLocalBusiness(businessId)
      .then((updatedBusiness) => {
        setBusinesses((currentBusinesses) => currentBusinesses.map((business) => (business.id === updatedBusiness.id ? updatedBusiness : business)))
      })
      .catch((error) => {
        console.error(error)
        setError("Impossibile pubblicare l'attività locale.")
      })
  }

  function handleUnpublish(businessId) {
    unpublishBackofficeLocalBusiness(businessId)
      .then((updatedBusiness) => {
        setBusinesses((currentBusinesses) => currentBusinesses.map((business) => (business.id === updatedBusiness.id ? updatedBusiness : business)))
      })
      .catch((error) => {
        console.error(error)
        setError("Impossibile rimettere l'attività locale in bozza.")
      })
  }

  function handleDelete(businessId) {
    const confirmed = window.confirm("Eliminare definitivamente questa attività locale?")

    if (!confirmed) return

    setError(null)

    deleteBackofficeLocalBusiness(businessId)
      .then(() => {
        setBusinesses((currentBusinesses) => currentBusinesses.filter((business) => business.id !== businessId))
      })
      .catch((error) => {
        console.error(error)
        setError("Non puoi eliminare questa attività locale perché ha reward collegati. Rimuovi prima i reward oppure usa Unpublish.")
      })
  }

  useEffect(() => {
    let ignore = false

    getBackofficeLocalBusinesses({ page, size: PAGE_SIZE })
      .then((data) => {
        if (ignore) {
          return
        }

        setPageData(data)
        setBusinesses(data.content || [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Impossibile caricare le attività locali.")
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
    return <p className="text-muted">Caricamento attività locali...</p>
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

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Local Businesses</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Gestisci attività locali, categorie business, città e stato di pubblicazione.
          </p>
        </div>

        <Link
          to="/backoffice/local-businesses/new"
          className="inline-flex rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Create business
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">City</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Address</th>
              <th className="px-4 py-3 font-normal">Website</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {businesses.map((business) => (
              <tr key={business.id} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{business.name}</td>

                <td className="px-4 py-4 text-muted">{business.cityName}</td>

                <td className="px-4 py-4 text-muted">{business.businessCategoryLabel}</td>

                <td className="px-4 py-4 text-muted">{business.address}</td>

                <td className="px-4 py-4 text-muted">
                  {business.websiteUrl ? (
                    <a href={business.websiteUrl} target="_blank" rel="noreferrer" className="text-accent hover:text-ink">
                      Website
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-4 py-4">
                  <span className={business.active ? "text-accent" : "text-muted"}>{business.active ? "Published" : "Draft"}</span>
                </td>

                <td className="w-[180px] px-4 py-4">
                  <div className="bo-actions">
                    <Link
                      to={`/backoffice/local-businesses/${business.id}/edit`}
                      className="bo-action bo-action--edit"
                      title="Edit"
                      aria-label="Edit local business"
                    >
                      ✎
                    </Link>

                    {business.active ? (
                      <button
                        type="button"
                        onClick={() => handleUnpublish(business.id)}
                        className="bo-action bo-action--publish"
                        title="Unpublish"
                        aria-label="Unpublish local business"
                      >
                        ↓
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePublish(business.id)}
                        className="bo-action bo-action--publish"
                        title="Publish"
                        aria-label="Publish local business"
                      >
                        ↑
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(business.id)}
                      className="bo-action bo-action--delete"
                      title="Delete"
                      aria-label="Delete local business"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {businesses.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-muted">
                  Nessuna attività locale presente.
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

export default LocalBusinessList
