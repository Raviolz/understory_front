import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../api/authApi"
import AuthCard from "../components/layout/AuthCard"
import mirrorFrame from "../assets/auth/mirror1.png"

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
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)
    setError(null)

    registerUser(formData)
      .then(() => {
        navigate("/login")
      })
      .catch((error) => {
        console.error(error)
        setError("Registrazione non riuscita. Controlla i dati inseriti.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <section className="auth-page auth-page--register">
      <div className="auth-page__panel">
        <div className="auth-scene">
          <div className="auth-scene__glass">
            <AuthCard label="UNDERSTORY ARCHIVE" title="Benvenuto" description="Ottieni un accesso e inizia ad esplorare">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                      className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
                      required
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
                      className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
                      required
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
                    className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
                    required
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
                    className="w-full rounded-xl border border-border-soft bg-canvas px-4 py-3 text-ink outline-none focus:border-accent"
                    required
                    minLength={6}
                  />
                </div>

                {error && <p className="text-sm text-arcane">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Invio richiesta..." : "Crea accesso"}
                </button>

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
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
