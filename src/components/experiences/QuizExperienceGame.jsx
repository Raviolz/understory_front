import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getMyProfile } from "../../api/authApi"
import { submitQuizAnswer } from "../../api/gameplayApi"
import { getPublishedQuizGameByExperience } from "../../api/publicApi"
import { setCurrentUser } from "../../redux/authSlice"

function QuizExperienceGame({ experience, onComplete }) {
  const dispatch = useDispatch()

  const [quizGame, setQuizGame] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!experience?.id) return

    getPublishedQuizGameByExperience(experience.id)
      .then((data) => {
        setQuizGame(data)
        setSelectedAnswer(null)
        setResult(null)
        setError(null)
      })
      .catch((error) => {
        console.error(error)
        setQuizGame(null)
        setError("Non riesco a caricare il quiz.")
      })
  }, [experience?.id])

  function handleSubmitAnswer() {
    if (!selectedAnswer) return

    setIsSubmitting(true)
    setError(null)

    submitQuizAnswer({
      experienceId: experience.id,
      selectedAnswer,
    })
      .then((data) => {
        if (data.completed) {
          getMyProfile()
            .then((updatedUser) => {
              dispatch(setCurrentUser(updatedUser))
            })
            .catch((error) => {
              console.error(error)
            })
            .finally(() => {
              onComplete(data)
            })

          return
        }

        setResult(data)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a inviare la risposta.")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

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
            onClick={() => {
              setSelectedAnswer(answer.value)
              setResult(null)
            }}
            disabled={isSubmitting}
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
        onClick={handleSubmitAnswer}
        disabled={!selectedAnswer || isSubmitting}
        className="mt-8 rounded-full border border-accent-soft px-6 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? "Submitting..." : "Submit answer"}
      </button>

      {result && !result.completed && (
        <div className="mt-8 rounded-2xl border border-border-soft bg-canvas p-5">
          <p className="text-arcane">{result.message}</p>
        </div>
      )}
    </section>
  )
}

export default QuizExperienceGame
