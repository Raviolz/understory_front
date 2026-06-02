import { useState } from "react"
import BackofficeSelect from "../BackofficeSelect"

const emptyForm = {
  experienceId: "",
  questionText: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  correctAnswer: "",
  explanationText: "",
}

function QuizGameForm({ experiences = [], initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    experienceId: initialValues.experienceId || "",
    questionText: initialValues.questionText || "",
    answerA: initialValues.answerA || "",
    answerB: initialValues.answerB || "",
    answerC: initialValues.answerC || "",
    answerD: initialValues.answerD || "",
    correctAnswer: initialValues.correctAnswer || "",
    explanationText: initialValues.explanationText || "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    setIsSaving(true)
    setError(null)

    onSubmit(formData)
      .catch((error) => {
        console.error(error)
        setError("Non riesco a salvare il quiz. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-4xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Collega il quiz a un'esperienza e imposta domanda, risposte e spiegazione.</p>

      <div className="mt-6">
        <BackofficeSelect
          inputId="experienceId"
          label="Experience"
          value={formData.experienceId}
          required
          placeholder="Select experience"
          options={experiences.map((experience) => ({
            value: experience.id,
            label: [experience.cityName, experience.pointOfInterestName, experience.title].filter(Boolean).join(" — "),
          }))}
          onChange={(value) => {
            setFormData({
              ...formData,
              experienceId: value,
            })
          }}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="questionText" className="mb-2 block text-sm text-muted">
          Question
        </label>

        <textarea
          id="questionText"
          name="questionText"
          rows="4"
          value={formData.questionText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="answerA" className="mb-2 block text-sm text-muted">
            Answer A
          </label>

          <input
            id="answerA"
            name="answerA"
            value={formData.answerA}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="answerB" className="mb-2 block text-sm text-muted">
            Answer B
          </label>

          <input
            id="answerB"
            name="answerB"
            value={formData.answerB}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="answerC" className="mb-2 block text-sm text-muted">
            Answer C
          </label>

          <input
            id="answerC"
            name="answerC"
            value={formData.answerC}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="answerD" className="mb-2 block text-sm text-muted">
            Answer D
          </label>

          <input
            id="answerD"
            name="answerD"
            value={formData.answerD}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <BackofficeSelect
          inputId="correctAnswer"
          label="Correct answer"
          value={formData.correctAnswer}
          required
          placeholder="Select correct answer"
          options={[
            { value: "A", label: "A" },
            { value: "B", label: "B" },
            { value: "C", label: "C" },
            { value: "D", label: "D" },
          ]}
          onChange={(value) => {
            setFormData({
              ...formData,
              correctAnswer: value,
            })
          }}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="explanationText" className="mb-2 block text-sm text-muted">
          Explanation
        </label>

        <textarea
          id="explanationText"
          name="explanationText"
          rows="5"
          value={formData.explanationText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      {error && <p className="mt-5 text-sm text-arcane">{error}</p>}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-border-soft px-5 py-3 text-sm text-muted transition hover:border-accent-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default QuizGameForm
