import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeBusinessCategoryById, updateBackofficeBusinessCategory } from "../../../api/backofficeApi"
import BusinessCategoryForm from "../../../components/backoffice/business_categories/BusinessCategoryForm"

function BoBusinessCategoryEditPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const [category, setCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeBusinessCategoryById(categoryId)
      .then((data) => {
        setCategory(data)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare la categoria business.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [categoryId])

  function handleUpdate(categoryData) {
    return updateBackofficeBusinessCategory(categoryId, categoryData).then(() => {
      navigate("/backoffice/business-categories")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento categoria business...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/business-categories")} className="text-sm text-muted hover:text-accent">
        ← Business Categories
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit business category</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica una categoria usata per classificare le attività locali.</p>
      </div>

      <BusinessCategoryForm
        initialValues={category}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate("/backoffice/business-categories")}
      />
    </section>
  )
}

export default BoBusinessCategoryEditPage
