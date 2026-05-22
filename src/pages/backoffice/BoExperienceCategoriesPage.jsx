import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeExperienceCategories } from "../../api/backofficeApi"

function BoExperienceCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeExperienceCategories()
      .then((data) => {
        setCategories(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le categorie esperienze.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <p className="text-muted">Caricamento categorie esperienze...</p>
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

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Experience Categories</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci le categorie narrative usate per classificare le esperienze.</p>
        </div>

        <Link
          to="/backoffice/experience-categories/new"
          className="inline-flex rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Create category
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border-soft bg-surface">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Label</th>
              <th className="px-4 py-3 font-normal">Code</th>
              <th className="px-4 py-3 font-normal">Icon</th>
              <th className="px-4 py-3 font-normal">Color</th>
              <th className="px-4 py-3 font-normal">Description</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{category.label}</td>
                <td className="px-4 py-4 text-muted">{category.code}</td>
                <td className="px-4 py-4 text-muted">{category.icon}</td>
                <td className="px-4 py-4 text-muted">{category.color}</td>
                <td className="px-4 py-4 text-muted">{category.description}</td>
                <td className="px-4 py-4">
                  <Link to={`/backoffice/experience-categories/${category.id}/edit`} className="text-accent hover:text-ink">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-muted">
                  Nessuna categoria esperienza presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default BoExperienceCategoriesPage
