import { useNavigate } from "react-router-dom"
import { createBackofficeExperienceCategory } from "../../../api/backofficeApi"
import ExperienceCategoryForm from "../../../components/backoffice/experience_categories/ExperienceCategoryForm"

function BoExperienceCategoryCreatePage() {
  const navigate = useNavigate()

  function handleCreate(categoryData) {
    return createBackofficeExperienceCategory(categoryData).then(() => {
      navigate("/backoffice/experience-categories")
    })
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/experience-categories")} className="text-sm text-muted hover:text-accent">
        ← Experience Categories
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create experience category</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea una nuova categoria narrativa per classificare le esperienze.</p>
      </div>

      <ExperienceCategoryForm submitLabel="Create category" onSubmit={handleCreate} onCancel={() => navigate("/backoffice/experience-categories")} />
    </section>
  )
}

export default BoExperienceCategoryCreatePage
