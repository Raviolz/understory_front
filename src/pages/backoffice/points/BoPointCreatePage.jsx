import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createBackofficePoint, getBackofficeCities } from "../../../api/backofficeApi"
import PointForm from "../../../components/backoffice/points/PointForm"

function BoPointCreatePage() {
  const navigate = useNavigate()

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
        setError("Non riesco a caricare le città per il form.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  function handleCreate(pointData) {
    return createBackofficePoint(pointData).then(() => {
      navigate("/backoffice/points")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento form...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/points")} className="text-sm text-muted hover:text-accent">
        ← Points of Interest
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create point</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea un nuovo punto di interesse collegato a una città dell'archivio.</p>
      </div>

      <PointForm cities={cities} submitLabel="Create point" onSubmit={handleCreate} onCancel={() => navigate("/backoffice/points")} />
    </section>
  )
}

export default BoPointCreatePage
