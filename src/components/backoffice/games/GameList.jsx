import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BackofficePagination from "../BackofficePagination"
import { deleteBackofficeQuizGame, deleteBackofficeUploadGame, getBackofficeQuizGames, getBackofficeUploadGames } from "../../../api/backofficeApi"

const PAGE_SIZE = 20

function GameList() {
  const [quizGames, setQuizGames] = useState([])
  const [quizPageData, setQuizPageData] = useState(null)
  const [quizPage, setQuizPage] = useState(0)

  const [uploadGames, setUploadGames] = useState([])
  const [uploadPageData, setUploadPageData] = useState(null)
  const [uploadPage, setUploadPage] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  function handleQuizPageChange(nextPage) {
    if (nextPage === quizPage) {
      return
    }

    setIsLoading(true)
    setError(null)
    setQuizPage(nextPage)
  }

  function handleUploadPageChange(nextPage) {
    if (nextPage === uploadPage) {
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadPage(nextPage)
  }

  function handleDeleteQuizGame(quizGameId) {
    const confirmed = window.confirm("Eliminare definitivamente questo quiz game?")

    if (!confirmed) return

    setError(null)

    deleteBackofficeQuizGame(quizGameId)
      .then(() => {
        setQuizGames((currentGames) => currentGames.filter((game) => game.id !== quizGameId))
      })
      .catch((error) => {
        console.error(error)
        setError(
          "Non puoi eliminare questo quiz game perché l'esperienza collegata ha già progressi o submissions. Usa la modifica o controlla l'esperienza collegata.",
        )
      })
  }

  function handleDeleteUploadGame(uploadGameId) {
    const confirmed = window.confirm("Eliminare definitivamente questo upload game?")

    if (!confirmed) return

    setError(null)

    deleteBackofficeUploadGame(uploadGameId)
      .then(() => {
        setUploadGames((currentGames) => currentGames.filter((game) => game.id !== uploadGameId))
      })
      .catch((error) => {
        console.error(error)
        setError(
          "Non puoi eliminare questo upload game perché l'esperienza collegata ha già progressi o submissions. Usa la modifica o controlla l'esperienza collegata.",
        )
      })
  }

  useEffect(() => {
    let ignore = false

    Promise.all([getBackofficeQuizGames({ page: quizPage, size: PAGE_SIZE }), getBackofficeUploadGames({ page: uploadPage, size: PAGE_SIZE })])
      .then(([quizData, uploadData]) => {
        if (ignore) {
          return
        }

        setQuizPageData(quizData)
        setQuizGames(quizData?.content || [])

        setUploadPageData(uploadData)
        setUploadGames(uploadData?.content || [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Non riesco a caricare i giochi.")
      })
      .finally(() => {
        if (ignore) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [quizPage, uploadPage])

  if (isLoading) {
    return <p className="text-muted">Caricamento giochi...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <Link to="/backoffice" className="text-sm text-muted hover:text-accent">
        ← Backoffice
      </Link>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Games</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">Gestisci configurazioni quiz e task di upload collegati alle esperienze.</p>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-ink">Quiz Games</h2>

          <Link
            to="/backoffice/quiz-games/new"
            className="rounded-full border border-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
          >
            Create quiz
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-border-soft text-muted">
              <tr>
                <th className="px-4 py-3 font-normal">City</th>
                <th className="px-4 py-3 font-normal">Point</th>
                <th className="px-4 py-3 font-normal">Experience</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>

            <tbody>
              {quizGames.map((game) => (
                <tr key={game.id} className="border-b border-border-soft last:border-b-0">
                  <td className="px-4 py-4 text-muted">{game.cityName || "—"}</td>
                  <td className="px-4 py-4 text-muted">{game.pointOfInterestName || "—"}</td>
                  <td className="px-4 py-4 text-ink">{game.experienceTitle}</td>

                  <td className="px-4 py-4">
                    <div className="bo-actions">
                      <Link to={`/backoffice/quiz-games/${game.id}/edit`} className="bo-action bo-action--edit" title="Edit" aria-label="Edit quiz game">
                        ✎
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteQuizGame(game.id)}
                        className="bo-action bo-action--delete"
                        title="Delete"
                        aria-label="Delete quiz game"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {quizGames.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-muted">
                    Nessun quiz presente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <BackofficePagination pageData={quizPageData} onPageChange={handleQuizPageChange} />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-ink">Upload Games</h2>

          <Link
            to="/backoffice/upload-games/new"
            className="rounded-full border border-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
          >
            Create upload task
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-soft bg-surface">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="border-b border-border-soft text-muted">
              <tr>
                <th className="px-4 py-3 font-normal">City</th>
                <th className="px-4 py-3 font-normal">Point</th>
                <th className="px-4 py-3 font-normal">Experience</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>

            <tbody>
              {uploadGames.map((game) => (
                <tr key={game.id} className="border-b border-border-soft last:border-b-0">
                  <td className="px-4 py-4 text-muted">{game.cityName || "—"}</td>
                  <td className="px-4 py-4 text-muted">{game.pointOfInterestName || "—"}</td>
                  <td className="px-4 py-4 text-ink">{game.experienceTitle}</td>

                  <td className="px-4 py-4">
                    <div className="bo-actions">
                      <Link to={`/backoffice/upload-games/${game.id}/edit`} className="bo-action bo-action--edit" title="Edit" aria-label="Edit upload game">
                        ✎
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteUploadGame(game.id)}
                        className="bo-action bo-action--delete"
                        title="Delete"
                        aria-label="Delete upload game"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {uploadGames.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-muted">
                    Nessun upload task presente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <BackofficePagination pageData={uploadPageData} onPageChange={handleUploadPageChange} />
      </section>
    </section>
  )
}

export default GameList
