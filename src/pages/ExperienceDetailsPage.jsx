import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPublishedExperienceById } from "../api/publicApi"
import QuizExperienceGame from "../components/experiences/QuizExperienceGame"
import UploadExperienceGame from "../components/experiences/UploadExperienceGame"

function ExperienceDetailsPage() {
  const { experienceId } = useParams()

  const [experience, setExperience] = useState(null)
  const [storyStep, setStoryStep] = useState(0)
  const [error, setError] = useState(null)
  const [gameResult, setGameResult] = useState(null)

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
        eyebrow: experience.experienceCategoryLabel,
        title: experience.title,
        text: experience.hookText,
      },
      {
        eyebrow: "Archive fragment",
        title: "Before you begin",
        text: experience.introText,
      },
      {
        eyebrow: "Hidden context",
        title: "What the city remembers",
        text: experience.contextText,
      },
      {
        eyebrow: "Threshold",
        title: "Follow the trace",
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
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <p className="text-muted">Caricamento esperienza...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <p className="text-arcane">{error}</p>
      </main>
    )
  }

  if (!experience) {
    return (
      <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
        <p className="text-muted">Esperienza non trovata.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <Link to="/explore" className="text-sm text-muted hover:text-accent">
        ← Back to explore
      </Link>

      <section className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-muted">
          <span>{experience.gameType}</span>
          <span>XP {experience.xpReward}</span>
          <span>Difficulty {experience.difficulty}</span>
        </div>

        {!isGameStep ? (
          <article className="mt-10 rounded-3xl border border-border-soft bg-surface p-6 md:p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-accent">{currentStoryPage.eyebrow}</p>

            <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">{currentStoryPage.title}</h1>

            <p className="mt-8 text-base leading-8 text-muted md:text-lg">{currentStoryPage.text}</p>

            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={goBack}
                disabled={storyStep === 0}
                className="rounded-full border border-border-soft px-5 py-3 text-sm text-muted transition hover:border-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              <div className="text-xs uppercase tracking-[0.2em] text-muted">
                {storyStep + 1} / {storyPages.length}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
              >
                {storyStep === storyPages.length - 1 ? "Enter the game" : "Continue"}
              </button>
            </div>
          </article>
        ) : (
          <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6 md:p-8">
            <button type="button" onClick={goBack} className="mb-6 text-sm text-muted transition hover:text-accent">
              ← Back
            </button>

            {gameResult ? (
              <section>
                <p className="text-sm uppercase tracking-[0.25em] text-accent">Revelation</p>

                <h2 className="mt-4 font-serif text-3xl text-ink">{experience.revealTitle}</h2>

                {gameResult.explanationText && <p className="mt-6 text-sm leading-7 text-muted md:text-base">{gameResult.explanationText}</p>}

                {experience.revealText && <p className="mt-6 text-sm leading-7 text-muted md:text-base">{experience.revealText}</p>}

                <div className="mt-8 rounded-2xl border border-border-soft bg-canvas p-5 text-sm text-muted">
                  <p>{gameResult.message}</p>
                  <p className="mt-2">XP awarded: {gameResult.xpAwarded}</p>

                  {gameResult.rewardUnlocked && <p className="mt-2 text-accent">Reward unlocked: {gameResult.rewardTitle}</p>}
                </div>
              </section>
            ) : (
              <>
                {experience.gameType === "QUIZ" && <QuizExperienceGame experience={experience} onComplete={setGameResult} />}

                {experience.gameType === "IMAGE_UPLOAD" && <UploadExperienceGame experience={experience} />}

                {experience.gameType !== "QUIZ" && experience.gameType !== "IMAGE_UPLOAD" && (
                  <p className="text-muted">Tipo di gioco non supportato: {experience.gameType}</p>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default ExperienceDetailsPage
