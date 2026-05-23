import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeCities, getBackofficePointById, updateBackofficePoint, uploadBackofficePointImage } from "../../../api/backofficeApi"
import PointForm from "../../../components/backoffice/points/PointForm"

function BoPointEditPage() {
  const { pointId } = useParams()
  const navigate = useNavigate()

  const [point, setPoint] = useState(null)
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficePointById(pointId), getBackofficeCities()])
      .then(([pointData, citiesData]) => {
        setPoint(pointData)
        setCities(citiesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare il punto di interesse.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [pointId])

  function handleUpdate(pointData, imageFile) {
    return updateBackofficePoint(pointId, pointData)
      .then(() => {
        if (!imageFile) {
          return null
        }

        return uploadBackofficePointImage(pointId, imageFile)
      })
      .then(() => {
        navigate("/backoffice/points")
      })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento punto di interesse...</p>
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

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit point</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica il punto di interesse selezionato.</p>
      </div>

      <PointForm cities={cities} initialValues={point} submitLabel="Save changes" onSubmit={handleUpdate} onCancel={() => navigate("/backoffice/points")} />
    </section>
  )
}

export default BoPointEditPage
