import { useState } from "react"

function EditProfileForm({ currentUser, isSaving, error, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: currentUser.username || "",
    name: currentUser.name || "",
    surname: currentUser.surname || "",
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(formData)
  }

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <p className="edit-profile-form__title">Modifica fascicolo</p>

      <label>
        Username
        <input name="username" value={formData.username} onChange={handleChange} minLength="3" maxLength="50" required />
      </label>

      <label>
        Nome
        <input name="name" value={formData.name} onChange={handleChange} maxLength="100" required />
      </label>

      <label>
        Cognome
        <input name="surname" value={formData.surname} onChange={handleChange} maxLength="100" required />
      </label>

      {error && <p className="edit-profile-form__error">{error}</p>}

      <div className="edit-profile-form__actions">
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Annulla
        </button>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Aggiornamento…" : "Aggiorna"}
        </button>
      </div>
    </form>
  )
}

export default EditProfileForm
