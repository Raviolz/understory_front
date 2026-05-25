import { useEffect, useState } from "react"
import { getPublishedUploadGameByExperience } from "../../api/publicApi"

function UploadExperienceGame({ experience }) {
  const [uploadGame, setUploadGame] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!experience?.id) return

    getPublishedUploadGameByExperience(experience.id)
      .then((data) => {
        setUploadGame(data)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setUploadGame(null)
        setError("Non riesco a caricare il gioco upload.")
      })
  }, [experience?.id])

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  if (!uploadGame) {
    return <p className="text-muted">Caricamento upload game...</p>
  }

  return (
    <section>
      <p className="text-sm uppercase tracking-[0.25em] text-accent">Image upload</p>

      <h2 className="mt-4 font-serif text-3xl text-ink">{uploadGame.promptText}</h2>

      <p className="mt-5 text-sm leading-7 text-muted md:text-base">{uploadGame.targetDescription}</p>

      {uploadGame.validationHint && (
        <p className="mt-4 rounded-2xl border border-border-soft bg-canvas p-4 text-sm leading-6 text-muted">{uploadGame.validationHint}</p>
      )}

      {uploadGame.referenceImageUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft">
          <img src={uploadGame.referenceImageUrl} alt="Reference" className="max-h-[320px] w-full object-cover" />
        </div>
      )}

      <label className="mt-8 block">
        <span className="text-sm text-accent">Upload your image</span>

        <input
          type="file"
          accept="image/*"
          onChange={(event) => setSelectedFile(event.target.files[0] || null)}
          className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-accent-soft file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-accent"
        />
      </label>

      <button
        type="button"
        disabled={!selectedFile}
        className="mt-8 rounded-full border border-accent-soft px-6 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit image
      </button>
    </section>
  )
}

export default UploadExperienceGame
