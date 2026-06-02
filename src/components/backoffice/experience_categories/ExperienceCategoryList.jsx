import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BackofficePagination from "../BackofficePagination"
import { deleteBackofficeExperienceCategory, getBackofficeExperienceCategories } from "../../../api/backofficeApi"

const PAGE_SIZE = 15

function ExperienceCategoryList() {
  const [categories, setCategories] = useState([])
  const [pageData, setPageData] = useState(null)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  function handlePageChange(nextPage) {
    if (nextPage === page) {
      return
    }

    setIsLoading(true)
    setError(null)
    setPage(nextPage)
  }

  function handleDelete(categoryId) {
    const confirmed = window.confirm("Eliminare definitivamente questa categoria esperienza?")

    if (!confirmed) return

    setError(null)

    deleteBackofficeExperienceCategory(categoryId)
      .then(() => {
        setCategories((currentCategories) => currentCategories.filter((category) => category.id !== categoryId))
      })
      .catch((error) => {
        console.error(error)
        setError("Non puoi eliminare questa categoria esperienza perché è usata da una o più esperienze.")
      })
  }

  useEffect(() => {
    let ignore = false

    getBackofficeExperienceCategories({ page, size: PAGE_SIZE })
      .then((data) => {
        if (ignore) {
          return
        }

        setPageData(data)
        setCategories(data.content || [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Non riesco a caricare le categorie esperienze.")
      })
      .finally(() => {
        if (ignore) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page])

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

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
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
                  <div className="bo-actions">
                    <Link
                      to={`/backoffice/experience-categories/${category.id}/edit`}
                      className="bo-action bo-action--edit"
                      title="Edit"
                      aria-label="Edit experience category"
                    >
                      ✎
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      className="bo-action bo-action--delete"
                      title="Delete"
                      aria-label="Delete experience category"
                    >
                      ×
                    </button>
                  </div>
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

      <BackofficePagination pageData={pageData} onPageChange={handlePageChange} />
    </section>
  )
}

export default ExperienceCategoryList
