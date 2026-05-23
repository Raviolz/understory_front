import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeCityById, updateBackofficeCity, uploadBackofficeCityCoverImage } from "../../../api/backofficeApi"
import CityForm from "../../../components/backoffice/cities/CityForm"

function BoCityEditPage() {
  const { cityId } = useParams()
  const navigate = useNavigate()

  const [city, setCity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeCityById(cityId)
      .then((data) => {
        setCity(data)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare la città.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [cityId])

  function handleUpdate(cityData, imageFile) {
    return updateBackofficeCity(cityId, cityData)
      .then(() => {
        if (!imageFile) {
          return null
        }

        return uploadBackofficeCityCoverImage(cityId, imageFile)
      })
      .then(() => {
        navigate("/backoffice/cities")
      })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento città...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/cities")} className="text-sm text-muted hover:text-accent">
        ← Cities
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit city</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica i dati della città selezionata.</p>
      </div>

      <CityForm initialValues={city} submitLabel="Save changes" onSubmit={handleUpdate} onCancel={() => navigate("/backoffice/cities")} />
    </section>
  )
}

export default BoCityEditPage
