import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../api/authApi"
import AuthCard from "../components/layout/AuthCard"
import mirrorFrame from "../assets/auth/MirrorAuth.png"

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
  })

  const [error, setError] = useState(null)
  const [registerStatus, setRegisterStatus] = useState("idle")

  const isLoading = registerStatus === "loading"
  const isSuccess = registerStatus === "success"
  const isFormDisabled = isLoading || isSuccess

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function wait(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds)
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setRegisterStatus("loading")
    setError(null)

    try {
      await registerUser(formData)

      setRegisterStatus("success")

      await wait(800)

      navigate("/login", { replace: true })
    } catch (error) {
      console.error(error)
      setError("Impossibile completare la registrazione. Controlla i dati inseriti.")
      setRegisterStatus("idle")
    }
  }

  return (
    <section className="auth-page auth-page--register">
      <div className="auth-page__panel">
        <div className="auth-mobile-heading">
          <p className="auth-card__label">UNDERSTORY ARCHIVE</p>
          <h1 className="auth-card__title">Benvenuto</h1>
          <p className="auth-card__description">Ottieni un accesso e inizia ad esplorare</p>
        </div>

        <div className="auth-scene">
          <div className="auth-scene__glass">
            <AuthCard label="UNDERSTORY ARCHIVE" title="Benvenuto" description="Ottieni un accesso e inizia ad esplorare">
              <form onSubmit={handleSubmit} className="auth-form auth-form--register">
                <div>
                  <label htmlFor="username" className="mb-2 block text-sm text-muted">
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                    required
                    disabled={isFormDisabled}
                  />
                </div>

                <div className="auth-form__name-row grid grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm text-muted">
                      Nome
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                      required
                      disabled={isFormDisabled}
                    />
                  </div>

                  <div>
                    <label htmlFor="surname" className="mb-2 block text-sm text-muted">
                      Cognome
                    </label>

                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      value={formData.surname}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                      required
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-muted">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                    required
                    disabled={isFormDisabled}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm text-muted">
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                    required
                    minLength={6}
                    disabled={isFormDisabled}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFormDisabled}
                  className="w-full rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Creazione accesso…" : isSuccess ? "Accesso creato…" : "Crea accesso"}
                </button>

                {isLoading && <p className="auth-form__status">Preparazione del tuo accesso all’archivio…</p>}

                {isSuccess && <p className="auth-form__status auth-form__status--success">Accesso registrato. Ora puoi entrare nell’archivio.</p>}

                <p className="text-center text-sm text-muted">
                  Hai già un accesso?{" "}
                  <Link to="/login" className="text-accent hover:text-ink">
                    Entra nell'archivio
                  </Link>
                </p>
              </form>
            </AuthCard>
          </div>

          <img src={mirrorFrame} alt="" aria-hidden="true" className="auth-scene__mirror" />

          {error && <p className="auth-page-error">{error}</p>}
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
