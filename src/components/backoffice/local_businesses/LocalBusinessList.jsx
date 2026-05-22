import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeLocalBusinesses } from "../../../api/backofficeApi"

function LocalBusinessList() {
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeLocalBusinesses()
      .then((data) => {
        setBusinesses(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le attività locali.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

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

                <td className="px-4 py-4">
                  <Link to={`/backoffice/local-businesses/${business.id}/edit`} className="text-accent hover:text-ink">
                    Edit
                  </Link>
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
    </section>
  )
}

export default LocalBusinessList
