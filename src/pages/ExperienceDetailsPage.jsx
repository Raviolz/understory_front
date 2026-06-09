import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { getPublishedExperienceById } from "../api/publicApi"
import { getExperienceCompletion } from "../api/meApi"
import QuizExperienceGame from "../components/experiences/QuizExperienceGame"
import UploadExperienceGame from "../components/experiences/UploadExperienceGame"
import Loader from "../components/ui/Loader"
import ErrorLoader from "../components/ui/ErrorLoader"
import revealPoster from "../assets/city/RevealPosterB.png"
import "../style/games.css"

function ExperienceDetailsPage() {
  const { experienceId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedRevealMode = searchParams.get("reveal") === "true"

  const [experience, setExperience] = useState(null)
  const [completion, setCompletion] = useState(null)
  const [storyStep, setStoryStep] = useState(0)
  const [error, setError] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(requestedRevealMode)

  function getGameLabel(gameType) {
    if (gameType === "QUIZ") return "Enigma"
    if (gameType === "IMAGE_UPLOAD") return "Rilevamento"

    return "Traccia"
  }

  function formatDifficulty(difficulty) {
    const romanNumbers = ["", "I", "II", "III", "IV", "V"]

    return romanNumbers[difficulty] || difficulty
  }

  function loadCompletion() {
    if (!experienceId) return Promise.resolve(null)

    return getExperienceCompletion(experienceId)
      .then((data) => {
        setCompletion(data)
        return data
      })
      .catch((error) => {
        console.error(error)
        setCompletion(null)
        throw error
      })
  }

  useEffect(() => {
    if (!experienceId) return

    getPublishedExperienceById(experienceId)
      .then((data) => {
        setExperience(data)
        setCompletion(null)
        setStoryStep(0)
        setGameResult(null)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setExperience(null)
        setCompletion(null)
        setError("Impossibile caricare l'esperienza.")
      })
  }, [experienceId])

  useEffect(() => {
    if (!requestedRevealMode || !experienceId) return

    let ignore = false

    getExperienceCompletion(experienceId)
      .then((data) => {
        if (ignore) return
        setCompletion(data)
      })
      .catch((error) => {
        if (ignore) return
        console.error(error)
        setCompletion(null)
        setError("Impossibile verificare la rivelazione archiviata.")
      })
      .finally(() => {
        if (ignore) return
        setIsCheckingCompletion(false)
      })

    return () => {
      ignore = true
    }
  }, [requestedRevealMode, experienceId])

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

  const archivedRevealAllowed = requestedRevealMode && completion?.completed === true
  const isGameStep = archivedRevealAllowed || storyStep >= storyPages.length
  const isRevealStep = archivedRevealAllowed || Boolean(gameResult)
  const currentStoryPage = storyPages[storyStep]

  const revealTitle = completion?.revealTitle || experience?.revealTitle || "Rivelazione"
  const explanationText = gameResult?.explanationText || completion?.explanationText || ""
  const revealXpText = gameResult ? `XP ottenuti: ${gameResult.xpAwarded}` : `XP registrati: ${experience?.xpReward ?? 0}`

  function handlePageBack() {
    if (isGameStep && !archivedRevealAllowed && storyPages.length > 0) {
      setGameResult(null)
      setStoryStep(storyPages.length - 1)
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate("/explore")
  }

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

  function handleGameComplete(result) {
    setGameResult(result)

    loadCompletion().catch(() => {
      setError("Impossibile caricare la rivelazione.")
    })
  }

  function getRevealMessageLines() {
    if (!gameResult?.message) {
      return ["Scoperta archiviata."]
    }

    return gameResult.message
      .split(".")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `${line}.`)
  }

  if (!experience && !error) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <div className="experience-state">
            <Loader label="Caricamento esperienza…" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <div className="experience-state">
            <ErrorLoader message={error} />
          </div>
        </div>
      </section>
    )
  }

  if (!experience) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <div className="experience-state">
            <p className="experience-message">Esperienza non trovata.</p>
          </div>
        </div>
      </section>
    )
  }

  if (requestedRevealMode && isCheckingCompletion) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <div className="experience-state">
            <Loader label="Verifico la rivelazione archiviata…" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="experience-page">
      <div className="experience-panel">
        <button type="button" onClick={handlePageBack} className="experience-back">
          ← Indietro
        </button>

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
                {isRevealStep ? (
                  <section className="experience-reveal">
                    {Array.from({ length: 16 }).map((_, index) => (
                      <span key={`star-${index}`} className={`experience-reveal__star experience-reveal__star--${index + 1}`} aria-hidden="true">
                        ✦
                      </span>
                    ))}

                    <div className="experience-reveal__poster-wrap">
                      <div className="experience-reveal__side-lights experience-reveal__side-lights--top" aria-hidden="true">
                        {Array.from({ length: 7 }).map((_, index) => (
                          <span key={`top-light-${index}`} className="experience-reveal__light" />
                        ))}
                      </div>

                      <img src={revealPoster} alt="" className="experience-reveal__poster-image" />

                      <div className="experience-reveal__content">
                        <p className="experience-reveal__kicker">Rivelazione</p>

                        <h2 className="experience-reveal__title">{revealTitle}</h2>

                        <div className="experience-reveal__divider" />

                        <p className="experience-reveal__text">{explanationText || "Rivelazione archiviata nell'Archivio personale."}</p>

                        <div className="experience-reveal__divider" />

                        <div className="experience-reveal__meta">
                          {getRevealMessageLines().map((line, index) => (
                            <p key={line} className={index === 0 ? "experience-reveal__answer-status" : undefined}>
                              {line}
                            </p>
                          ))}

                          <p className="experience-reveal__xp">{revealXpText}</p>
                        </div>
                      </div>

                      <div className="experience-reveal__side-lights experience-reveal__side-lights--bottom" aria-hidden="true">
                        {Array.from({ length: 7 }).map((_, index) => (
                          <span key={`bottom-light-${index}`} className="experience-reveal__light" />
                        ))}
                      </div>
                    </div>
                  </section>
                ) : (
                  <>
                    {experience.gameType === "QUIZ" && <QuizExperienceGame experience={experience} onComplete={handleGameComplete} />}

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
