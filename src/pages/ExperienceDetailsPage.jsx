import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPublishedExperienceById } from "../api/publicApi"
import QuizExperienceGame from "../components/experiences/QuizExperienceGame"
import UploadExperienceGame from "../components/experiences/UploadExperienceGame"
import "../style/games.css"

function ExperienceDetailsPage() {
  const { experienceId } = useParams()

  const [experience, setExperience] = useState(null)
  const [storyStep, setStoryStep] = useState(0)
  const [error, setError] = useState(null)
  const [gameResult, setGameResult] = useState(null)

  function getGameLabel(gameType) {
    if (gameType === "QUIZ") return "Enigma"
    if (gameType === "IMAGE_UPLOAD") return "Rilevamento"

    return "Traccia"
  }

  function formatDifficulty(difficulty) {
    const romanNumbers = ["", "I", "II", "III", "IV", "V"]

    return romanNumbers[difficulty] || difficulty
  }

  useEffect(() => {
    if (!experienceId) return

    getPublishedExperienceById(experienceId)
      .then((data) => {
        setExperience(data)
        setStoryStep(0)
        setGameResult(null)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setExperience(null)
        setError("Non riesco a caricare l’esperienza.")
      })
  }, [experienceId])

  const storyPages = useMemo(() => {
    if (!experience) return []

    return [
      {
        eyebrow: "Il primo segno",
        title: experience.title,
        text: experience.hookText,
      },
      {
        eyebrow: "Frammento d'archivio",
        title: "Prima di iniziare",
        text: experience.introText,
      },
      {
        eyebrow: "Memoria nascosta",
        title: "Ciò che la città ricorda",
        text: experience.contextText,
      },
      {
        eyebrow: "La soglia",
        title: "Segui la traccia",
        text: experience.leadInText,
      },
    ].filter((page) => page.text && page.text.trim() !== "")
  }, [experience])

  const isGameStep = storyStep >= storyPages.length
  const currentStoryPage = storyPages[storyStep]

  function goNext() {
    setStoryStep((currentStep) => currentStep + 1)
  }

  function goBack() {
    if (gameResult) {
      setGameResult(null)
      return
    }

    setStoryStep((currentStep) => Math.max(currentStep - 1, 0))
  }

  if (!experience && !error) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <p className="experience-message">Caricamento esperienza...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <p className="experience-message experience-message--error">{error}</p>
        </div>
      </section>
    )
  }

  if (!experience) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <p className="experience-message">Esperienza non trovata.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="experience-page">
      <div className="experience-panel">
        <Link to="/explore" className="experience-back">
          ← Back
        </Link>

        <section className={isGameStep ? "experience-shell experience-shell--game" : "experience-shell"}>
          {!isGameStep ? (
            <article className="experience-fragment">
              <div className="experience-fragment__paper">
                <div className="experience-arcane-meta" aria-label="Dettagli esperienza">
                  <span>{getGameLabel(experience.gameType)}</span>
                  <span>✶ {experience.xpReward}</span>
                  <span>△ {formatDifficulty(experience.difficulty)}</span>
                </div>

                <p className="experience-kicker">{currentStoryPage.eyebrow}</p>

                <h1 className="experience-title">{currentStoryPage.title}</h1>

                <p className="experience-text">{currentStoryPage.text}</p>

                <div className="experience-controls">
                  <button type="button" onClick={goBack} disabled={storyStep === 0} className="experience-button experience-button--muted">
                    ← Indietro
                  </button>

                  <div className="experience-progress">
                    {storyStep + 1} / {storyPages.length}
                  </div>

                  <button type="button" onClick={goNext} className="experience-button">
                    {storyStep === storyPages.length - 1 ? "Inizia la prova →" : "Continua →"}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <article className="experience-fragment experience-fragment--game">
              <div className="experience-game-stage">
                {gameResult ? (
                  <section>
                    <p className="experience-kicker">Rivelazione</p>

                    <h2 className="experience-title experience-title--small">{experience.revealTitle}</h2>

                    {gameResult.explanationText && <p className="experience-text">{gameResult.explanationText}</p>}

                    {experience.revealText && <p className="experience-text experience-text--secondary">{experience.revealText}</p>}

                    <div className="experience-result">
                      <p>{gameResult.message}</p>
                      <p>XP ottenuti: {gameResult.xpAwarded}</p>

                      {gameResult.rewardUnlocked && <p className="experience-result__reward">Accesso sbloccato: {gameResult.rewardTitle}</p>}
                    </div>
                  </section>
                ) : (
                  <>
                    {experience.gameType === "QUIZ" && <QuizExperienceGame experience={experience} onComplete={setGameResult} />}

                    {experience.gameType === "IMAGE_UPLOAD" && <UploadExperienceGame experience={experience} />}

                    {experience.gameType !== "QUIZ" && experience.gameType !== "IMAGE_UPLOAD" && (
                      <p className="experience-message">Tipo di gioco non supportato: {experience.gameType}</p>
                    )}
                  </>
                )}
              </div>
            </article>
          )}
        </section>
      </div>
    </section>
  )
}

export default ExperienceDetailsPage
