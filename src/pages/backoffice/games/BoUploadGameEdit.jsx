import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeExperiences, getBackofficeUploadGameById, updateBackofficeUploadGame } from "../../../api/backofficeApi"
import UploadGameForm from "../../../components/backoffice/games/UploadGameForm"

function BoUploadGameEditPage() {
  const { uploadGameId } = useParams()
  const navigate = useNavigate()

  const [uploadGame, setUploadGame] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeUploadGameById(uploadGameId), getBackofficeExperiences()])
      .then(([uploadGameData, experiencesData]) => {
        const uploadExperiences = (experiencesData.content || []).filter((experience) => experience.gameType === "IMAGE_UPLOAD")

        setUploadGame(uploadGameData)
        setExperiences(uploadExperiences)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare l’upload game.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [uploadGameId])

  function handleUpdate(uploadData) {
    return updateBackofficeUploadGame(uploadGameId, uploadData).then(() => {
      navigate("/backoffice/games")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento upload game...</p>
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

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit upload game</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica prompt, target e indicazioni di validazione del task di upload.</p>
      </div>

      <UploadGameForm
        experiences={experiences}
        initialValues={uploadGame}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate("/backoffice/games")}
      />
    </section>
  )
}

export default BoUploadGameEditPage
