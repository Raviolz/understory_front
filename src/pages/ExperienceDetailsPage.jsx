import { useEffect, useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { getPublishedExperienceById } from "../api/publicApi"
import { getExperienceCompletion } from "../api/meApi"
import QuizExperienceGame from "../components/experiences/QuizExperienceGame"
import UploadExperienceGame from "../components/experiences/UploadExperienceGame"
import Loader from "../components/ui/Loader"
import revealCircusBg from "../assets/city/backcircus.jpg"
import revealMain from "../assets/city/reveal.png"
import revealBottom from "../assets/city/cartiglionosfondo.png"
import "../style/games.css"

function ExperienceDetailsPage() {
  const { experienceId } = useParams()
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
        setError("Non riesco a caricare l’esperienza.")
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
        setError("Non riesco a verificare la rivelazione archiviata.")
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
      setError("Esperienza completata, ma non riesco a caricare la rivelazione.")
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
          <Loader label="Caricamento esperienza…" />
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

  if (requestedRevealMode && isCheckingCompletion) {
    return (
      <section className="experience-page">
        <div className="experience-panel">
          <Loader label="Verifico la rivelazione archiviata…" />
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
                {isRevealStep ? (
                  <section className="experience-reveal">
                    <div
                      className="experience-reveal__poster"
                      style={{
                        backgroundImage: `linear-gradient(rgba(37, 13, 20, 0.12), rgba(17, 10, 14, 0.2)), url(${revealCircusBg})`,
                      }}
                    >
                      <div className="experience-reveal__main-cartouche">
                        <img src={revealMain} alt="" className="experience-reveal__main-cartouche-image" />

                        <div className="experience-reveal__main-cartouche-content">
                          <p className="experience-reveal__kicker">Rivelazione</p>

                          <h2 className="experience-reveal__title">{revealTitle}</h2>

                          {explanationText ? (
                            <p className="experience-reveal__text">{explanationText}</p>
                          ) : (
                            <p className="experience-reveal__text">Rivelazione archiviata nell’Archivio personale.</p>
                          )}
                        </div>
                      </div>

                      <div className="experience-reveal__ribbon">
                        <img src={revealBottom} alt="" className="experience-reveal__ribbon-image" />

                        <div className="experience-reveal__ribbon-content">
                          {getRevealMessageLines().map((line) => (
                            <p key={line}>{line}</p>
                          ))}

                          <p>{revealXpText}</p>

                          {gameResult?.rewardUnlocked && <p className="experience-reveal__reward">Accesso sbloccato: {gameResult.rewardTitle}</p>}
                        </div>
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
