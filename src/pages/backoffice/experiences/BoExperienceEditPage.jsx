import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getBackofficeExperienceById,
  getBackofficeExperienceCategories,
  getBackofficePoints,
  updateBackofficeExperience,
  uploadBackofficeExperienceRevealImage,
} from "../../../api/backofficeApi"
import ExperienceForm from "../../../components/backoffice/experiences/ExperienceForm"

function BoExperienceEditPage() {
  const { experienceId } = useParams()
  const navigate = useNavigate()

  const [experience, setExperience] = useState(null)
  const [points, setPoints] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeExperienceById(experienceId), getBackofficePoints(), getBackofficeExperienceCategories()])
      .then(([experienceData, pointsData, categoriesData]) => {
        setExperience(experienceData)
        setPoints(pointsData.content || [])
        setCategories(categoriesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare l'esperienza.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [experienceId])

  function handleUpdate(experienceData, imageFile) {
    return updateBackofficeExperience(experienceId, experienceData)
      .then(() => {
        if (!imageFile) {
          return null
        }

        return uploadBackofficeExperienceRevealImage(experienceId, imageFile)
      })
      .then(() => {
        navigate("/backoffice/experiences")
      })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento esperienza...</p>
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

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit experience</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica l'esperienza narrativa selezionata.</p>
      </div>

      <ExperienceForm
        points={points}
        categories={categories}
        initialValues={experience}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate("/backoffice/experiences")}
      />
    </section>
  )
}

export default BoExperienceEditPage
