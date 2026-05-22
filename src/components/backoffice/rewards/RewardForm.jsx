import { useState } from "react"

const emptyForm = {
  businessId: "",
  cityId: "",
  title: "",
  description: "",
  discountCode: "",
  rewardType: "",
  validFrom: "",
  validUntil: "",
}

const rewardTypes = ["DISCOUNT", "FREE_ENTRY", "BOOKING_UNLOCK", "SECRET_CONTENT"]

function RewardForm({ businesses = [], cities = [], initialValues = emptyForm, submitLabel, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    businessId: initialValues.businessId || "",
    cityId: initialValues.cityId || "",
    title: initialValues.title || "",
    description: initialValues.description || "",
    discountCode: initialValues.discountCode || "",
    rewardType: initialValues.rewardType || "",
    validFrom: initialValues.validFrom || "",
    validUntil: initialValues.validUntil || "",
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

    const rewardData = {
      ...formData,
      discountCode: formData.discountCode || null,
    }

    onSubmit(rewardData)
      .catch((error) => {
        console.error(error)
        setError(error.message || "Non riesco a salvare la ricompensa. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-4xl rounded-2xl border border-border-soft bg-surface p-6">
      <h2 className="font-serif text-2xl text-ink">{submitLabel}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">Collega la ricompensa a una città e a un’attività locale.</p>

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
          <label htmlFor="businessId" className="mb-2 block text-sm text-muted">
            Local business
          </label>

          <select
            id="businessId"
            name="businessId"
            value={formData.businessId}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          >
            <option value="">Select business</option>

            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
                {business.cityName ? ` — ${business.cityName}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
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

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="rewardType" className="mb-2 block text-sm text-muted">
            Reward type
          </label>

          <select
            id="rewardType"
            name="rewardType"
            value={formData.rewardType}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          >
            <option value="">Select reward type</option>

            {rewardTypes.map((rewardType) => (
              <option key={rewardType} value={rewardType}>
                {rewardType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="discountCode" className="mb-2 block text-sm text-muted">
            Discount code
          </label>

          <input
            id="discountCode"
            name="discountCode"
            value={formData.discountCode}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="validFrom" className="mb-2 block text-sm text-muted">
            Valid from
          </label>

          <input
            id="validFrom"
            name="validFrom"
            type="date"
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor="validUntil" className="mb-2 block text-sm text-muted">
            Valid until
          </label>

          <input
            id="validUntil"
            name="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={handleChange}
            className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
            required
          />
        </div>
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

export default RewardForm
