import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeExperienceCategoryById, updateBackofficeExperienceCategory } from "../../../api/backofficeApi"
import ExperienceCategoryForm from "../../../components/backoffice/experience_categories/ExperienceCategoryForm"

function BoExperienceCategoryEditPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const [category, setCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeExperienceCategoryById(categoryId)
      .then((data) => {
        setCategory(data)
      })
      .catch((error) => {
        console.error(error)
        setError("Impossibile caricare la categoria.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [categoryId])

  function handleUpdate(categoryData) {
    return updateBackofficeExperienceCategory(categoryId, categoryData).then(() => {
      navigate("/backoffice/experience-categories")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento categoria...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/experience-categories")} className="text-sm text-muted hover:text-accent">
        ← Experience Categories
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit experience category</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica una categoria narrativa usata per classificare le esperienze.</p>
      </div>

      <ExperienceCategoryForm
        initialValues={category}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate("/backoffice/experience-categories")}
      />
    </section>
  )
}

export default BoExperienceCategoryEditPage
