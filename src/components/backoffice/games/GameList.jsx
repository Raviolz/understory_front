import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeQuizGames, getBackofficeUploadGames } from "../../../api/backofficeApi"

function GameList() {
  const [quizGames, setQuizGames] = useState([])
  const [uploadGames, setUploadGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeQuizGames(), getBackofficeUploadGames()])
      .then(([quizData, uploadData]) => {
        setQuizGames(quizData.content || [])
        setUploadGames(uploadData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare i giochi.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

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

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci configurazioni quiz e task di upload collegati alle esperienze.</p>
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
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead className="border-b border-border-soft text-muted">
              <tr>
                <th className="px-4 py-3 font-normal">Experience</th>
                <th className="px-4 py-3 font-normal">Question</th>
                <th className="px-4 py-3 font-normal">Correct answer</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>

            <tbody>
              {quizGames.map((game) => (
                <tr key={game.id} className="border-b border-border-soft last:border-b-0">
                  <td className="px-4 py-4 text-ink">{game.experienceTitle}</td>
                  <td className="px-4 py-4 text-muted">{game.questionText}</td>
                  <td className="px-4 py-4 text-muted">{game.correctAnswer}</td>
                  <td className="px-4 py-4">
                    <Link to={`/backoffice/quiz-games/${game.id}/edit`} className="text-accent hover:text-ink">
                      Edit
                    </Link>
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
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead className="border-b border-border-soft text-muted">
              <tr>
                <th className="px-4 py-3 font-normal">Experience</th>
                <th className="px-4 py-3 font-normal">Prompt</th>
                <th className="px-4 py-3 font-normal">Target</th>
                <th className="px-4 py-3 font-normal">Reference</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>

            <tbody>
              {uploadGames.map((game) => (
                <tr key={game.id} className="border-b border-border-soft last:border-b-0">
                  <td className="px-4 py-4 text-ink">{game.experienceTitle}</td>
                  <td className="px-4 py-4 text-muted">{game.promptText}</td>
                  <td className="px-4 py-4 text-muted">{game.targetDescription}</td>
                  <td className="px-4 py-4 text-muted">{game.referenceImageUrl ? "Yes" : "No"}</td>
                  <td className="px-4 py-4">
                    <Link to={`/backoffice/upload-games/${game.id}/edit`} className="text-accent hover:text-ink">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {uploadGames.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-muted">
                    Nessun upload task presente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default GameList
