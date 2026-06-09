import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getMyProfile, loginUser } from "../api/authApi"
import AuthCard from "../components/layout/AuthCard"
import { setCredentials, setCurrentUser } from "../redux/authSlice"
import mirrorFrame from "../assets/auth/MirrorAuth.png"

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState(null)
  const [loginStatus, setLoginStatus] = useState("idle")

  const isLoading = loginStatus === "loading"
  const isSuccess = loginStatus === "success"
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

    setLoginStatus("loading")
    setError(null)

    try {
      const data = await loginUser(formData)

      localStorage.setItem("accessToken", data.accessToken)

      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          user: null,
        }),
      )

      const profile = await getMyProfile()

      dispatch(setCurrentUser(profile))

      setLoginStatus("success")

      await wait(700)

      navigate("/", { replace: true })
    } catch (error) {
      console.error(error)
      setError("Impossibile accedere. Controlla email e password.")
      setLoginStatus("idle")
    }
  }

  return (
    <section className="auth-page auth-page--login">
      <div className="auth-page__panel">
        <div className="auth-mobile-heading">
          <p className="auth-card__label">UNDERSTORY ARCHIVE</p>
          <h1 className="auth-card__title">Bentornato</h1>
          <p className="auth-card__description">Accedi per continuare il tuo percorso.</p>
        </div>

        <div className="auth-scene">
          <div className="auth-scene__glass">
            <AuthCard label="UNDERSTORY ARCHIVE" title="Bentornato" description="Accedi per continuare il tuo percorso.">
              <form onSubmit={handleSubmit} className="auth-form">
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
                    disabled={isFormDisabled}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isFormDisabled}
                  className="w-full rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Accesso in corso…" : isSuccess ? "Archivio sbloccato…" : "Entra"}
                </button>

                {isLoading && <p className="auth-form__status">Verifica delle credenziali in corso…</p>}

                {isSuccess && <p className="auth-form__status auth-form__status--success">Bentornato nell’archivio.</p>}

                <p className="text-center text-sm text-muted">
                  Non hai ancora un accesso?{" "}
                  <Link to="/register" className="text-accent hover:text-ink">
                    Richiedilo qui
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

export default LoginPage
