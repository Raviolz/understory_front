import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBackofficeUploadSubmissions } from "../../api/backofficeApi"

function BoUploadSubmissionsPage() {
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBackofficeUploadSubmissions()
      .then((data) => {
        setSubmissions(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le submission upload.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <p className="text-muted">Caricamento submission upload...</p>
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

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Upload Submissions</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Revisiona le immagini inviate dagli utenti per completare le esperienze upload.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">User</th>
              <th className="px-4 py-3 font-normal">Experience</th>
              <th className="px-4 py-3 font-normal">Image</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Submitted at</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.submissionId} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{submission.username}</td>

                <td className="px-4 py-4 text-muted">{submission.experienceTitle}</td>

                <td className="px-4 py-4 text-muted">
                  {submission.imageUrl ? (
                    <a href={submission.imageUrl} target="_blank" rel="noreferrer" className="text-accent hover:text-ink">
                      Open image
                    </a>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-4 py-4 text-muted">{submission.status}</td>

                <td className="px-4 py-4 text-muted">{submission.submittedAt}</td>

                <td className="px-4 py-4">
                  <Link to={`/backoffice/upload-submissions/${submission.submissionId}`} className="text-accent hover:text-ink">
                    Review
                  </Link>
                </td>
              </tr>
            ))}

            {submissions.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-muted">
                  Nessuna submission upload presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default BoUploadSubmissionsPage
