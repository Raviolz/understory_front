import { useState } from "react"

const emptyForm = {
  name: "",
  country: "",
  longitude: "",
  latitude: "",
  description: "",
}

function CityForm({ initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialValues.name || "",
    country: initialValues.country || "",
    longitude: initialValues.longitude ?? "",
    latitude: initialValues.latitude ?? "",
    description: initialValues.description || "",
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

    const cityData = {
      ...formData,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    }

    onSubmit(cityData, imageFile)
      .catch((error) => {
        console.error(error)
        setError(error.message || "Impossibile salvare la città. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Compila i dati della città. Potrai pubblicarla o rimetterla in bozza dalla lista.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-muted">
            Name
          </label>

          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="mb-2 block text-sm text-muted">
            Country
          </label>

          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="mb-2 block text-sm text-muted">
            Latitude
          </label>

          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={formData.latitude}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="longitude" className="mb-2 block text-sm text-muted">
            Longitude
          </label>

          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={formData.longitude}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="coverImageFile" className="mb-2 block text-sm text-muted">
          Cover image file
        </label>
        {initialValues.coverImageUrl && (
          <a href={initialValues.coverImageUrl} target="_blank" rel="noreferrer" className="mb-3 inline-block text-sm text-accent hover:text-ink">
            Open current cover image
          </a>
        )}
        <input
          id="coverImageFile"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0] || null)}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-accent-soft file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-accent"
        />

        <p className="mt-2 text-xs text-muted">Se selezioni un file, verrà caricato dopo il salvataggio della città.</p>
      </div>
      <div className="mt-5">
        <label htmlFor="description" className="mb-2 block text-sm text-muted">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows="5"
          value={formData.description}
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

export default CityForm
