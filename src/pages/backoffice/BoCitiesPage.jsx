import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeCities } from "../../api/backofficeApi"

function BoCitiesPage() {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeCities()
      .then((data) => {
        setCities(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le città.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])
  if (isLoading) {
    return <p className="text-muted">Caricamento città...</p>
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

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Cities</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci città pubblicate e bozze dell’archivio.</p>
        </div>

        <Link
          to="/backoffice/cities/new"
          className="inline-flex rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Create city
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border-soft bg-surface">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Country</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Coordinates</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{city.name}</td>
                <td className="px-4 py-4 text-muted">{city.country}</td>
                <td className="px-4 py-4">
                  <span className={city.active ? "text-accent" : "text-muted"}>{city.active ? "Published" : "Draft"}</span>
                </td>
                <td className="px-4 py-4 text-muted">
                  {city.latitude}, {city.longitude}
                </td>
                <td className="px-4 py-4">
                  <Link to={`/backoffice/cities/${city.id}/edit`} className="text-accent hover:text-ink">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {cities.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted">
                  Nessuna città presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default BoCitiesPage
