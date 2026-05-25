import { useState } from "react"

const emptyForm = {
  experienceId: "",
  promptText: "",
  validationHint: "",
  targetDescription: "",
  explanationText: "",
}

function UploadGameForm({ experiences = [], initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    experienceId: initialValues.experienceId || "",
    promptText: initialValues.promptText || "",
    validationHint: initialValues.validationHint || "",
    targetDescription: initialValues.targetDescription || "",
    explanationText: initialValues.explanationText || "",
  })

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)

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

    const uploadData = {
      ...formData,
      validationHint: formData.validationHint || null,
      explanationText: formData.explanationText || null,
    }

    onSubmit(uploadData, imageFile)
      .catch((error) => {
        console.error(error)
        setError(error.message || "Non riesco a salvare l'upload game. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-4xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Collega il task di upload a un'esperienza di tipo UPLOAD.</p>

      <div className="mt-6">
        <label htmlFor="experienceId" className="mb-2 block text-sm text-muted">
          Experience
        </label>

        <select
          id="experienceId"
          name="experienceId"
          value={formData.experienceId}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        >
          <option value="">Select upload experience</option>

          {experiences.map((experience) => (
            <option key={experience.id} value={experience.id}>
              {experience.title} — {experience.gameType}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="promptText" className="mb-2 block text-sm text-muted">
          Prompt text
        </label>

        <textarea
          id="promptText"
          name="promptText"
          rows="4"
          value={formData.promptText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="targetDescription" className="mb-2 block text-sm text-muted">
          Target description
        </label>

        <textarea
          id="targetDescription"
          name="targetDescription"
          rows="4"
          value={formData.targetDescription}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="validationHint" className="mb-2 block text-sm text-muted">
          Validation hint
        </label>

        <textarea
          id="validationHint"
          name="validationHint"
          rows="4"
          value={formData.validationHint}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="explanationText" className="mb-2 block text-sm text-muted">
          Explanation text
        </label>

        <textarea
          id="explanationText"
          name="explanationText"
          rows="5"
          value={formData.explanationText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="referenceImageFile" className="mb-2 block text-sm text-muted">
          Reference image
        </label>

        {initialValues.referenceImageUrl && (
          <a href={initialValues.referenceImageUrl} target="_blank" rel="noreferrer" className="mb-3 inline-block text-sm text-accent hover:text-ink">
            Open current reference image
          </a>
        )}

        <input
          id="referenceImageFile"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0] || null)}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-accent-soft file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-accent"
        />

        <p className="mt-2 text-xs text-muted">Se selezioni un file, verrà caricato dopo il salvataggio dell’upload game.</p>
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

export default UploadGameForm
