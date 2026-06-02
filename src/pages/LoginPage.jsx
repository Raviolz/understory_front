import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getMyProfile, loginUser } from "../api/authApi"
import AuthCard from "../components/layout/AuthCard"
import Loader from "../components/ui/Loader"
import { setCredentials, setCurrentUser } from "../redux/authSlice"
import mirrorFrame from "../assets/auth/mirror1.png"

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
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

    loginUser(formData)
      .then((data) => {
        localStorage.setItem("accessToken", data.accessToken)

        dispatch(
          setCredentials({
            accessToken: data.accessToken,
            user: null,
          }),
        )

        return getMyProfile()
      })
      .then((profile) => {
        dispatch(setCurrentUser(profile))
        navigate("/")
      })
      .catch((error) => {
        console.error(error)
        setError("Accesso non riuscito. Controlla email e password.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <section className="auth-page">
      <div className="auth-page__panel">
        <div className="auth-scene">
          <div className="auth-scene__glass">
            <AuthCard label="UNDERSTORY ARCHIVE" title="Bentornato" description="Accedi per continuare il tuo percorso.">
              {isLoading ? (
                <Loader label="Accesso in corso…" />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    />
                  </div>

                  {error && <p className="text-sm text-arcane">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Entra
                  </button>

                  <p className="text-center text-sm text-muted">
                    Non hai ancora un accesso?{" "}
                    <Link to="/register" className="text-accent hover:text-ink">
                      Richiedilo qui
                    </Link>
                  </p>
                </form>
              )}
            </AuthCard>
          </div>

          <img src={mirrorFrame} alt="" aria-hidden="true" className="auth-scene__mirror" />
        </div>
      </div>
    </section>
  )
}

export default LoginPage
