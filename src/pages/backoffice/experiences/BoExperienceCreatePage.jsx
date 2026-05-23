import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  createBackofficeExperience,
  getBackofficeExperienceCategories,
  getBackofficePoints,
  uploadBackofficeExperienceRevealImage,
} from "../../../api/backofficeApi"
import ExperienceForm from "../../../components/backoffice/experiences/ExperienceForm"

function BoExperienceCreatePage() {
  const navigate = useNavigate()

  const [points, setPoints] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficePoints(), getBackofficeExperienceCategories()])
      .then(([pointsData, categoriesData]) => {
        setPoints(pointsData.content || [])
        setCategories(categoriesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare i dati per il form.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  function handleCreate(experienceData, imageFile) {
    return createBackofficeExperience(experienceData)
      .then((createdExperience) => {
        if (!imageFile) {
          return createdExperience
        }

        return uploadBackofficeExperienceRevealImage(createdExperience.id, imageFile)
      })
      .then(() => {
        navigate("/backoffice/experiences")
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
      <button type="button" onClick={() => navigate("/backoffice/experiences")} className="text-sm text-muted hover:text-accent">
        ← Experiences
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create experience</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea una nuova esperienza narrativa collegata a un punto di interesse.</p>
      </div>

      <ExperienceForm
        points={points}
        categories={categories}
        submitLabel="Create experience"
        onSubmit={handleCreate}
        onCancel={() => navigate("/backoffice/experiences")}
      />
    </section>
  )
}

export default BoExperienceCreatePage
