import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeExperiences, publishBackofficeExperience, unpublishBackofficeExperience } from "../../../api/backofficeApi"

function ExperienceList() {
  const [experiences, setExperiences] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    getBackofficeExperiences()
      .then((data) => {
        setExperiences(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le esperienze.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

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
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/backoffice/experiences/${experience.id}/edit`} className="text-accent hover:text-ink">
                      Edit
                    </Link>
                    {experience.active ? (
                      <button type="button" onClick={() => handleUnpublish(experience.id)} className="text-muted hover:text-ink">
                        Unpublish
                      </button>
                    ) : (
                      <button type="button" onClick={() => handlePublish(experience.id)} className="text-muted hover:text-ink">
                        Publish
                      </button>
                    )}
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
    </section>
  )
}

export default ExperienceList
