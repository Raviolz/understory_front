import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeBusinessCategories, getBackofficeCities, getBackofficeLocalBusinessById, updateBackofficeLocalBusiness } from "../../../api/backofficeApi"
import LocalBusinessForm from "../../../components/backoffice/local_businesses/LocalBusinessForm"

function BoLocalBusinessEditPage() {
  const { businessId } = useParams()
  const navigate = useNavigate()

  const [business, setBusiness] = useState(null)
  const [cities, setCities] = useState([])
  const [businessCategories, setBusinessCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeLocalBusinessById(businessId), getBackofficeCities(), getBackofficeBusinessCategories()])
      .then(([businessData, citiesData, categoriesData]) => {
        setBusiness(businessData)
        setCities(citiesData.content || [])
        setBusinessCategories(categoriesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare l'attività locale.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [businessId])

  function handleUpdate(businessData) {
    return updateBackofficeLocalBusiness(businessId, businessData).then(() => {
      navigate("/backoffice/local-businesses")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento attività locale...</p>
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

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit local business</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica l'attività locale selezionata.</p>
      </div>

      <LocalBusinessForm
        cities={cities}
        businessCategories={businessCategories}
        initialValues={business}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate("/backoffice/local-businesses")}
      />
    </section>
  )
}

export default BoLocalBusinessEditPage
