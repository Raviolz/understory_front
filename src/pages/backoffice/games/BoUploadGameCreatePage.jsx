import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createBackofficeUploadGame, getBackofficeExperiences, uploadBackofficeUploadGameReferenceImage } from "../../../api/backofficeApi"
import UploadGameForm from "../../../components/backoffice/games/UploadGameForm"

function BoUploadGameCreatePage() {
  const navigate = useNavigate()

  const [experiences, setExperiences] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeExperiences()
      .then((data) => {
        const uploadExperiences = (data.content || []).filter((experience) => experience.gameType === "IMAGE_UPLOAD")

        setExperiences(uploadExperiences)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le esperienze per il form.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  function handleCreate(uploadData, imageFile) {
    return createBackofficeUploadGame(uploadData)
      .then((createdUploadGame) => {
        if (!imageFile) {
          return createdUploadGame
        }

        return uploadBackofficeUploadGameReferenceImage(createdUploadGame.id, imageFile)
      })
      .then(() => {
        navigate("/backoffice/games")
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
      <button type="button" onClick={() => navigate("/backoffice/games")} className="text-sm text-muted hover:text-accent">
        ← Games
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create upload game</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea un task di upload collegato a una specifica esperienza.</p>
      </div>

      <UploadGameForm experiences={experiences} submitLabel="Create upload task" onSubmit={handleCreate} onCancel={() => navigate("/backoffice/games")} />
    </section>
  )
}

export default BoUploadGameCreatePage
