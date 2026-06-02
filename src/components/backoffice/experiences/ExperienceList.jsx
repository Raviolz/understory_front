import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BackofficePagination from "../BackofficePagination"
import { deleteBackofficeExperience, getBackofficeExperiences, publishBackofficeExperience, unpublishBackofficeExperience } from "../../../api/backofficeApi"

const PAGE_SIZE = 15

function ExperienceList() {
  const [experiences, setExperiences] = useState([])
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

  function handlePublish(experienceId) {
    publishBackofficeExperience(experienceId)
      .then((updatedExperience) => {
        setExperiences((currentExperiences) =>
          currentExperiences.map((experience) => (experience.id === updatedExperience.id ? updatedExperience : experience)),
        )
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a pubblicare l'esperienza.")
      })
  }

  function handleUnpublish(experienceId) {
    unpublishBackofficeExperience(experienceId)
      .then((updatedExperience) => {
        setExperiences((currentExperiences) =>
          currentExperiences.map((experience) => (experience.id === updatedExperience.id ? updatedExperience : experience)),
        )
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a rimettere l'esperienza in bozza.")
      })
  }

  function handleDelete(experienceId) {
    const confirmed = window.confirm("Eliminare definitivamente questa esperienza?")

    if (!confirmed) return

    setError(null)

    deleteBackofficeExperience(experienceId)
      .then(() => {
        setExperiences((currentExperiences) => currentExperiences.filter((experience) => experience.id !== experienceId))
      })
      .catch((error) => {
        console.error(error)
        setError(
          "Non puoi eliminare questa esperienza perché ha progressi utente, submissions o un gioco quiz/upload collegato. Rimuovi prima il gioco collegato se è inutilizzata, oppure usa Unpublish.",
        )
      })
  }

  useEffect(() => {
    let ignore = false

    getBackofficeExperiences({ page, size: PAGE_SIZE })
      .then((data) => {
        if (ignore) {
          return
        }

        setPageData(data)
        setExperiences(data.content || [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Non riesco a caricare le esperienze.")
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
    return <p className="text-muted">Caricamento esperienze...</p>
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

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Experiences</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Gestisci esperienze narrative, categorie, tipologie di gioco, XP e stato di pubblicazione.
          </p>
        </div>

        <Link
          to="/backoffice/experiences/new"
          className="inline-flex rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Create experience
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Title</th>
              <th className="px-4 py-3 font-normal">City</th>
              <th className="px-4 py-3 font-normal">Point</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Game</th>
              <th className="px-4 py-3 font-normal">XP</th>
              <th className="px-4 py-3 font-normal">Difficulty</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {experiences.map((experience) => (
              <tr key={experience.id} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{experience.title}</td>

                <td className="px-4 py-4 text-muted">{experience.cityName}</td>

                <td className="px-4 py-4 text-muted">{experience.pointOfInterestName}</td>

                <td className="px-4 py-4 text-muted">{experience.experienceCategoryLabel}</td>

                <td className="px-4 py-4 text-muted">{experience.gameType}</td>

                <td className="px-4 py-4 text-muted">{experience.xpReward}</td>

                <td className="px-4 py-4 text-muted">{experience.difficulty}/5</td>

                <td className="px-4 py-4">
                  <span className={experience.active ? "text-accent" : "text-muted"}>{experience.active ? "Published" : "Draft"}</span>
                </td>

                <td className="px-4 py-4">
                  <div className="bo-actions">
                    <Link to={`/backoffice/experiences/${experience.id}/edit`} className="bo-action bo-action--edit" title="Edit" aria-label="Edit experience">
                      ✎
                    </Link>

                    {experience.active ? (
                      <button
                        type="button"
                        onClick={() => handleUnpublish(experience.id)}
                        className="bo-action bo-action--publish"
                        title="Unpublish"
                        aria-label="Unpublish experience"
                      >
                        ↓
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePublish(experience.id)}
                        className="bo-action bo-action--publish"
                        title="Publish"
                        aria-label="Publish experience"
                      >
                        ↑
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(experience.id)}
                      className="bo-action bo-action--delete"
                      title="Delete"
                      aria-label="Delete experience"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {experiences.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-muted">
                  Nessuna esperienza presente.
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

export default ExperienceList
