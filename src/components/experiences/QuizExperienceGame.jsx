import { useEffect, useState } from "react"
import { getPublishedQuizGameByExperience } from "../../api/publicApi"

function QuizExperienceGame({ experience }) {
  const [quizGame, setQuizGame] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!experience?.id) return

    getPublishedQuizGameByExperience(experience.id)
      .then((data) => {
        setQuizGame(data)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setQuizGame(null)
        setError("Non riesco a caricare il quiz.")
      })
  }, [experience?.id])

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  if (!quizGame) {
    return <p className="text-muted">Caricamento quiz...</p>
  }

  const answers = [
    { value: "A", label: quizGame.answerA },
    { value: "B", label: quizGame.answerB },
    { value: "C", label: quizGame.answerC },
    { value: "D", label: quizGame.answerD },
  ]

  return (
    <section>
      <p className="text-sm uppercase tracking-[0.25em] text-accent">Quiz</p>

      <h2 className="mt-4 font-serif text-3xl text-ink">{quizGame.questionText}</h2>

      <div className="mt-6 grid gap-3">
        {answers.map((answer) => (
          <button
            key={answer.value}
            type="button"
            onClick={() => setSelectedAnswer(answer.value)}
            className={
              selectedAnswer === answer.value
                ? "rounded-2xl border border-accent bg-accent px-5 py-4 text-left text-canvas transition"
                : "rounded-2xl border border-border-soft bg-canvas px-5 py-4 text-left text-ink transition hover:border-accent"
            }
          >
            <span className="mr-3 font-serif text-lg">{answer.value}.</span>
            {answer.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!selectedAnswer}
        className="mt-8 rounded-full border border-accent-soft px-6 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit answer
      </button>
    </section>
  )
}

export default QuizExperienceGame
