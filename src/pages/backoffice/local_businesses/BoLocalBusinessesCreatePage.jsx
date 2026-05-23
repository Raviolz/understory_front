import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  createBackofficeLocalBusiness,
  getBackofficeBusinessCategories,
  getBackofficeCities,
  uploadBackofficeLocalBusinessImage,
} from "../../../api/backofficeApi"
import LocalBusinessForm from "../../../components/backoffice/local_businesses/LocalBusinessForm"

function BoLocalBusinessCreatePage() {
  const navigate = useNavigate()

  const [cities, setCities] = useState([])
  const [businessCategories, setBusinessCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeCities(), getBackofficeBusinessCategories()])
      .then(([citiesData, categoriesData]) => {
        setCities(citiesData.content || [])
        setBusinessCategories(categoriesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare i dati per il form.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  function handleCreate(businessData, imageFile) {
    return createBackofficeLocalBusiness(businessData)
      .then((createdBusiness) => {
        if (!imageFile) {
          return createdBusiness
        }

        return uploadBackofficeLocalBusinessImage(createdBusiness.id, imageFile)
      })
      .then(() => {
        navigate("/backoffice/local-businesses")
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
      <button type="button" onClick={() => navigate("/backoffice/local-businesses")} className="text-sm text-muted hover:text-accent">
        ← Local Businesses
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create local business</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
          Crea una nuova attività locale collegata a una città e a una categoria business.
        </p>
      </div>

      <LocalBusinessForm
        cities={cities}
        businessCategories={businessCategories}
        submitLabel="Create business"
        onSubmit={handleCreate}
        onCancel={() => navigate("/backoffice/local-businesses")}
      />
    </section>
  )
}

export default BoLocalBusinessCreatePage
