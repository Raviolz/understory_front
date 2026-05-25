import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPublishedExperienceById } from "../api/publicApi"
import QuizExperienceGame from "../components/experiences/QuizExperienceGame"
import UploadExperienceGame from "../components/experiences/UploadExperienceGame"

function ExperienceDetailsPage() {
  const { experienceId } = useParams()

  const [experience, setExperience] = useState(null)
  const [phase, setPhase] = useState("intro")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!experienceId) return

    getPublishedExperienceById(experienceId)
      .then((data) => {
        setExperience(data)
        setPhase("intro")
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setExperience(null)
        setError("Non riesco a caricare l’esperienza.")
      })
  }, [experienceId])

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
        <p className="text-sm uppercase tracking-[0.25em] text-accent">{experience.experienceCategoryLabel}</p>

        <h1 className="mt-4 font-serif text-4xl md:text-5xl">{experience.title}</h1>

        <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-muted">
          <span>{experience.gameType}</span>
          <span>XP {experience.xpReward}</span>
          <span>Difficulty {experience.difficulty}</span>
        </div>

        {phase === "intro" ? (
          <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6 md:p-8">
            <p className="font-serif text-2xl leading-9 text-ink">{experience.hookText}</p>

            <p className="mt-6 text-sm leading-7 text-muted md:text-base">{experience.introText}</p>

            <button
              type="button"
              onClick={() => setPhase("game")}
              className="mt-8 inline-flex rounded-full border border-accent-soft px-6 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
            >
              Begin
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6 md:p-8">
            {experience.gameType === "QUIZ" && <QuizExperienceGame experience={experience} />}

            {experience.gameType === "IMAGE_UPLOAD" && <UploadExperienceGame experience={experience} />}

            {experience.gameType !== "QUIZ" && experience.gameType !== "IMAGE_UPLOAD" && (
              <p className="text-muted">Tipo di gioco non supportato: {experience.gameType}</p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default ExperienceDetailsPage
