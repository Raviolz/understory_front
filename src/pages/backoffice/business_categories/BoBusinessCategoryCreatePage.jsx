import { useNavigate } from "react-router-dom"
import { createBackofficeBusinessCategory } from "../../../api/backofficeApi"
import BusinessCategoryForm from "../../../components/backoffice/business_categories/BusinessCategoryForm"

function BoBusinessCategoryCreatePage() {
  const navigate = useNavigate()

  function handleCreate(categoryData) {
    return createBackofficeBusinessCategory(categoryData).then(() => {
      navigate("/backoffice/business-categories")
    })
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/business-categories")} className="text-sm text-muted hover:text-accent">
        ← Business Categories
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create business category</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea una nuova categoria per classificare le attività locali.</p>
      </div>

      <BusinessCategoryForm submitLabel="Create category" onSubmit={handleCreate} onCancel={() => navigate("/backoffice/business-categories")} />
    </section>
  )
}

export default BoBusinessCategoryCreatePage
