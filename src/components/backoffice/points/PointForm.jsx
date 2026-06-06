import { useState } from "react"
import BackofficeSelect from "../BackofficeSelect"

const emptyForm = {
  cityId: "",
  name: "",
  shortDescription: "",
  longitude: "",
  latitude: "",
}

function PointForm({ cities = [], initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cityId: initialValues.cityId || "",
    name: initialValues.name || "",
    shortDescription: initialValues.shortDescription || "",
    longitude: initialValues.longitude ?? "",
    latitude: initialValues.latitude ?? "",
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

    const pointData = {
      ...formData,
      longitude: Number(formData.longitude),
      latitude: Number(formData.latitude),
    }

    onSubmit(pointData, imageFile)
      .catch((error) => {
        console.error(error)
        setError("Impossibile salvare il punto di interesse. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Collega il punto di interesse a una città e inserisci coordinate e descrizione breve.</p>

      <div className="mt-6">
        <BackofficeSelect
          inputId="cityId"
          label="City"
          value={formData.cityId}
          required
          placeholder="Select city"
          options={cities.map((city) => ({
            value: city.id,
            label: `${city.name} — ${city.country}`,
          }))}
          onChange={(value) => {
            setFormData({
              ...formData,
              cityId: value,
            })
          }}
        />
      </div>

      <div className="mt-5">
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
        <label htmlFor="pointImageFile" className="mb-2 block text-sm text-muted">
          Point image
        </label>

        {initialValues.imageUrl && (
          <a href={initialValues.imageUrl} target="_blank" rel="noreferrer" className="mb-3 inline-block text-sm text-accent hover:text-ink">
            Open current image
          </a>
        )}

        <input
          id="pointImageFile"
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0] || null)}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border file:border-accent-soft file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-accent"
        />

        <p className="mt-2 text-xs text-muted">Se selezioni un file, verrà caricato dopo il salvataggio del punto.</p>
      </div>

      <div className="mt-5">
        <label htmlFor="shortDescription" className="mb-2 block text-sm text-muted">
          Short description
        </label>

        <textarea
          id="shortDescription"
          name="shortDescription"
          rows="5"
          value={formData.shortDescription}
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

export default PointForm
