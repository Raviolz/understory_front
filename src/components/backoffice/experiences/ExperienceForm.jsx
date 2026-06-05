import { useState } from "react"
import BackofficeSelect from "../BackofficeSelect"

const emptyForm = {
  pointOfInterestId: "",
  experienceCategoryId: "",
  title: "",
  gameType: "",
  hookText: "",
  introText: "",
  contextText: "",
  leadInText: "",
  revealTitle: "",
  revealText: "",
  journalText: "",
  atlasText: "",
  xpReward: "",
  difficulty: "",
}

function ExperienceForm({ points = [], categories = [], initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    pointOfInterestId: initialValues.pointOfInterestId || "",
    experienceCategoryId: initialValues.experienceCategoryId || "",
    title: initialValues.title || "",
    gameType: initialValues.gameType || "",
    hookText: initialValues.hookText || "",
    introText: initialValues.introText || "",
    contextText: initialValues.contextText || "",
    leadInText: initialValues.leadInText || "",
    revealTitle: initialValues.revealTitle || "",
    revealText: initialValues.revealText || "",
    journalText: initialValues.journalText || "",
    atlasText: initialValues.atlasText || "",
    xpReward: initialValues.xpReward ?? "",
    difficulty: initialValues.difficulty ?? "",
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

    const experienceData = {
      ...formData,
      contextText: formData.contextText || null,
      leadInText: formData.leadInText || null,
      atlasText: formData.atlasText || null,
      xpReward: Number(formData.xpReward),
      difficulty: Number(formData.difficulty),
    }

    onSubmit(experienceData, imageFile)
      .catch((error) => {
        console.error(error)
        setError("Non riesco a salvare l'esperienza. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-4xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Collega l'esperienza a un punto di interesse e a una categoria narrativa.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <BackofficeSelect
          inputId="pointOfInterestId"
          label="Point of interest"
          value={formData.pointOfInterestId}
          required
          placeholder="Select point"
          options={points.map((point) => ({
            value: point.id,
            label: `${point.name}${point.cityName ? ` — ${point.cityName}` : ""}`,
          }))}
          onChange={(value) => {
            setFormData({
              ...formData,
              pointOfInterestId: value,
            })
          }}
        />

        <BackofficeSelect
          inputId="experienceCategoryId"
          label="Experience category"
          value={formData.experienceCategoryId}
          required
          placeholder="Select category"
          options={categories.map((category) => ({
            value: category.id,
            label: category.label,
          }))}
          onChange={(value) => {
            setFormData({
              ...formData,
              experienceCategoryId: value,
            })
          }}
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm text-muted">
            Title
          </label>

          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <BackofficeSelect
          inputId="gameType"
          label="Game type"
          value={formData.gameType}
          required
          placeholder="Select game type"
          options={[
            { value: "QUIZ", label: "QUIZ" },
            { value: "IMAGE_UPLOAD", label: "IMAGE_UPLOAD" },
          ]}
          onChange={(value) => {
            setFormData({
              ...formData,
              gameType: value,
            })
          }}
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="xpReward" className="mb-2 block text-sm text-muted">
            XP reward
          </label>

          <input
            id="xpReward"
            name="xpReward"
            type="number"
            min="1"
            value={formData.xpReward}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="mb-2 block text-sm text-muted">
            Difficulty
          </label>

          <input
            id="difficulty"
            name="difficulty"
            type="number"
            min="1"
            max="5"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="hookText" className="mb-2 block text-sm text-muted">
          Hook text
        </label>

        <textarea
          id="hookText"
          name="hookText"
          rows="4"
          value={formData.hookText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="introText" className="mb-2 block text-sm text-muted">
          Intro text
        </label>

        <textarea
          id="introText"
          name="introText"
          rows="5"
          value={formData.introText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="contextText" className="mb-2 block text-sm text-muted">
          Context text
        </label>

        <textarea
          id="contextText"
          name="contextText"
          rows="5"
          value={formData.contextText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="leadInText" className="mb-2 block text-sm text-muted">
          Lead-in text
        </label>

        <textarea
          id="leadInText"
          name="leadInText"
          rows="5"
          value={formData.leadInText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="atlasText" className="mb-2 block text-sm text-muted">
          Atlas text
        </label>

        <textarea
          id="atlasText"
          name="atlasText"
          rows="7"
          value={formData.atlasText}
          onChange={handleChange}
          className="w-full rounded-xl border border-accent-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          placeholder="Testo discorsivo da mostrare nel libro Atlante dopo il completamento dell'esperienza."
        />

        <p className="mt-2 text-xs leading-5 text-muted">Questo testo viene usato solo nella pagina Atlante. Può restare vuoto per ora.</p>
      </div>

      <div className="mt-5">
        <label htmlFor="revealTitle" className="mb-2 block text-sm text-muted">
          Reveal title
        </label>

        <input
          id="revealTitle"
          name="revealTitle"
          value={formData.revealTitle}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="revealImageFile" className="mb-2 block text-sm text-muted">
          Reveal image
        </label>

        {initialValues.revealImageUrl && (
          <a href={initialValues.revealImageUrl} target="_blank" rel="noreferrer" className="mb-3 inline-block text-sm text-accent hover:text-ink">
            Open current reveal image
          </a>
        )}

        <input
          id="revealImageFile"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0] || null)}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-accent-soft file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-accent"
        />

        <p className="mt-2 text-xs text-muted">Se selezioni un file, verrà caricato dopo il salvataggio dell'esperienza.</p>
      </div>

      <div className="mt-5">
        <label htmlFor="revealText" className="mb-2 block text-sm text-muted">
          Reveal text
        </label>

        <textarea
          id="revealText"
          name="revealText"
          rows="5"
          value={formData.revealText}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          required
        />
      </div>

      <div className="mt-5">
        <label htmlFor="journalText" className="mb-2 block text-sm text-muted">
          Journal text
        </label>

        <textarea
          id="journalText"
          name="journalText"
          rows="4"
          value={formData.journalText}
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

export default ExperienceForm
