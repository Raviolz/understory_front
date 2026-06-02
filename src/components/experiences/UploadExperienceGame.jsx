import { useEffect, useRef, useState } from "react"
import { submitUploadSubmission } from "../../api/gameplayApi"
import { getPublishedUploadGameByExperience } from "../../api/publicApi"
import fortuneBoothImage from "../../assets/city/FortuneTeller.png"
import Loader from "../ui/Loader"

function UploadExperienceGame({ experience }) {
  const fileInputRef = useRef(null)

  const [uploadGame, setUploadGame] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!experience?.id) return

    getPublishedUploadGameByExperience(experience.id)
      .then((data) => {
        setUploadGame(data)
        setSelectedFile(null)
        setSubmission(null)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setUploadGame(null)
        setError("Non riesco a caricare il gioco upload.")
      })
  }, [experience?.id])

  function handleChooseFile() {
    if (isSubmitting) return
    fileInputRef.current?.click()
  }

  function handleCardClick() {
    if (isSubmitting) return

    if (!selectedFile) {
      handleChooseFile()
      return
    }

    handleSubmitImage()
  }

  function handleSubmitImage() {
    if (!selectedFile || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    submitUploadSubmission(experience.id, selectedFile)
      .then((data) => {
        setSubmission(data)
        setSelectedFile(null)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a inviare l’immagine.")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  if (error) {
    return <p className="experience-message experience-message--error">{error}</p>
  }

  if (!uploadGame) {
    return <Loader label="Preparazione rilevamento…" />
  }

  if (submission) {
    return (
      <section className="quiz-fortune">
        <div className="quiz-fortune__question">
          <span className="quiz-fortune__question-label">Traccia ricevuta</span>
          <h2 className="quiz-fortune__question-text">La tua immagine attende il responso.</h2>
        </div>

        <div className="quiz-fortune__booth">
          <div className="quiz-fortune__image-frame">
            <img src={fortuneBoothImage} alt="Cabina dell'oracolo" className="quiz-fortune__image" />
          </div>

          <div className="quiz-fortune__window">
            <div className="quiz-fortune__cards">
              <article className="quiz-fortune-card quiz-fortune-card--c quiz-fortune-card--selected">
                <span className="quiz-fortune-card__symbol">✦</span>
                <span className="quiz-fortune-card__text">
                  Immagine inviata.
                  {submission.status ? ` Stato: ${submission.status}` : ""}
                </span>
              </article>
            </div>
          </div>
        </div>

        {submission.imageUrl && <p className="quiz-fortune__result">La traccia è stata consegnata. Quando sarà approvata, l’esperienza verrà completata.</p>}
      </section>
    )
  }

  return (
    <section className="quiz-fortune">
      <div className="quiz-fortune__question">
        <span className="quiz-fortune__question-label">La tua prova</span>
        <h2 className="quiz-fortune__question-text">{uploadGame.promptText}</h2>
      </div>

      <div className="quiz-fortune__booth">
        <div className="quiz-fortune__image-frame">
          <img src={fortuneBoothImage} alt="Cabina dell'oracolo" className="quiz-fortune__image" />
        </div>

        <div className="quiz-fortune__window">
          <div className="quiz-fortune__cards">
            <button
              type="button"
              onClick={handleCardClick}
              disabled={isSubmitting}
              className={["quiz-fortune-card", "quiz-fortune-card--upload", selectedFile ? "quiz-fortune-card--selected" : ""].filter(Boolean).join(" ")}
            >
              <span className="quiz-fortune-card__symbol">☽</span>

              <span className="quiz-fortune-card__text">
                {selectedFile ? selectedFile.name : uploadGame.targetDescription || "Scegli un’immagine da consegnare."}
              </span>

              <span className="quiz-fortune-card__seal">{isSubmitting ? "Consulta…" : selectedFile ? "Sigilla →" : "Carica →"}</span>
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => {
            setSelectedFile(event.target.files[0] || null)
            event.target.value = ""
          }}
          className="hidden"
        />
      </div>

      {uploadGame.validationHint && !selectedFile && <p className="quiz-fortune__result">{uploadGame.validationHint}</p>}
    </section>
  )
}

export default UploadExperienceGame
