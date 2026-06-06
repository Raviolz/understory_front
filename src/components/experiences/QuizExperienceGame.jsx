import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getMyProfile } from "../../api/authApi"
import { submitQuizAnswer } from "../../api/gameplayApi"
import { getPublishedQuizGameByExperience } from "../../api/publicApi"
import { setCurrentUser } from "../../redux/authSlice"
import fortuneBoothImage from "../../assets/city/FortuneTeller.png"
import Loader from "../ui/Loader"
import ErrorLoader from "../ui/ErrorLoader"

function QuizExperienceGame({ experience, onComplete }) {
  const dispatch = useDispatch()

  const [quizGame, setQuizGame] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageError, setPageError] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!experience?.id) return

    getPublishedQuizGameByExperience(experience.id)
      .then((data) => {
        setQuizGame(data)
        setSelectedAnswer(null)
        setResult(null)
        setPageError(null)
        setSubmitError(null)
      })
      .catch((error) => {
        console.error(error)
        setQuizGame(null)
        setPageError("Impossibile caricare l'enigma.")
      })
  }, [experience?.id])

  function handleSelectAnswer(answerValue) {
    setSelectedAnswer(answerValue)
    setResult(null)
    setSubmitError(null)
  }

  function handleCardClick(answerValue) {
    if (isSubmitting) return

    if (selectedAnswer === answerValue) {
      handleSubmitAnswer()
      return
    }

    handleSelectAnswer(answerValue)
  }

  function handleSubmitAnswer() {
    if (!selectedAnswer || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)

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
        setSubmitError("Impossibile inviare la risposta.")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  if (pageError) {
    return <ErrorLoader message={pageError} />
  }

  if (!quizGame) {
    return <Loader label="Caricamento enigma…" />
  }

  const answers = [
    { value: "A", symbol: "✶", label: quizGame.answerA },
    { value: "B", symbol: "☽", label: quizGame.answerB },
    { value: "C", symbol: "⊙", label: quizGame.answerC },
    { value: "D", symbol: "✦", label: quizGame.answerD },
  ]

  return (
    <section className="quiz-fortune">
      <div className="quiz-fortune__question">
        <span className="quiz-fortune__question-label">Il tuo enigma</span>
        <h2 className="quiz-fortune__question-text">{quizGame.questionText}</h2>
      </div>

      <div className="quiz-fortune__booth">
        <div className="quiz-fortune__image-frame">
          <img src={fortuneBoothImage} alt="Cabina dell'oracolo" className="quiz-fortune__image" />
        </div>

        <div className="quiz-fortune__window">
          <div className="quiz-fortune__cards">
            {answers.map((answer) => {
              const isSelected = selectedAnswer === answer.value
              const isDimmed = selectedAnswer && !isSelected

              return (
                <button
                  key={answer.value}
                  type="button"
                  onClick={() => handleCardClick(answer.value)}
                  disabled={isSubmitting}
                  className={[
                    "quiz-fortune-card",
                    `quiz-fortune-card--${answer.value.toLowerCase()}`,
                    isSelected ? "quiz-fortune-card--selected" : "",
                    isDimmed ? "quiz-fortune-card--dimmed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isSelected}
                >
                  <span className="quiz-fortune-card__symbol">{answer.symbol}</span>
                  <span className="quiz-fortune-card__text">{answer.label}</span>

                  {isSelected && <span className="quiz-fortune-card__seal">{isSubmitting ? "Consultandoci…" : "Sigilla →"}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {submitError && <p className="quiz-fortune__soft-error">{submitError}</p>}

      {result && !result.completed && <p className="quiz-fortune__result">{result.message || "La carta non custodisce questa verità. Scegline un'altra."}</p>}
    </section>
  )
}

export default QuizExperienceGame
