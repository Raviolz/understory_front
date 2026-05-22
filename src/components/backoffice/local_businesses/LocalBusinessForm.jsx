import { useState } from "react"

const emptyForm = {
  cityId: "",
  businessCategoryId: "",
  name: "",
  address: "",
  description: "",
  websiteUrl: "",
  imageUrl: "",
  longitude: "",
  latitude: "",
}

function LocalBusinessForm({ cities = [], businessCategories = [], initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cityId: initialValues.cityId || "",
    businessCategoryId: initialValues.businessCategoryId || "",
    name: initialValues.name || "",
    address: initialValues.address || "",
    description: initialValues.description || "",
    websiteUrl: initialValues.websiteUrl || "",
    imageUrl: initialValues.imageUrl || "",
    longitude: initialValues.longitude ?? "",
    latitude: initialValues.latitude ?? "",
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

    const businessData = {
      ...formData,
      websiteUrl: formData.websiteUrl || null,
      imageUrl: formData.imageUrl || null,
      longitude: Number(formData.longitude),
      latitude: Number(formData.latitude),
    }

    onSubmit(businessData)
      .catch((error) => {
        console.error(error)
        setError("Non riesco a salvare l’attività locale. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-3xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Collega l’attività locale a una città e a una categoria business.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cityId" className="mb-2 block text-sm text-muted">
            City
          </label>

          <select
            id="cityId"
            name="cityId"
            value={formData.cityId}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          >
            <option value="">Select city</option>

            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} — {city.country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="businessCategoryId" className="mb-2 block text-sm text-muted">
            Business category
          </label>

          <select
            id="businessCategoryId"
            name="businessCategoryId"
            value={formData.businessCategoryId}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          >
            <option value="">Select category</option>

            {businessCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
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

      <div className="mt-5">
        <label htmlFor="address" className="mb-2 block text-sm text-muted">
          Address
        </label>

        <input
          id="address"
          name="address"
          value={formData.address}
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
        <label htmlFor="websiteUrl" className="mb-2 block text-sm text-muted">
          Website URL
        </label>

        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          value={formData.websiteUrl}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="imageUrl" className="mb-2 block text-sm text-muted">
          Image URL
        </label>

        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
        />
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

export default LocalBusinessForm
