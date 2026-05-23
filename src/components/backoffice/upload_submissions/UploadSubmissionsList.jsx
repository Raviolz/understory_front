import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { approveBackofficeUploadSubmission, getBackofficeUploadSubmissionsByStatus, rejectBackofficeUploadSubmission } from "../../../api/backofficeApi"
function UploadSubmissionsList() {
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  function removeSubmissionFromList(reviewResponse) {
    setSubmissions((currentSubmissions) => currentSubmissions.filter((submission) => submission.submissionId !== reviewResponse.submissionId))
  }

  function handleApprove(submissionId) {
    approveBackofficeUploadSubmission(submissionId)
      .then((reviewResponse) => {
        removeSubmissionFromList(reviewResponse)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco ad approvare la submission.")
      })
  }

  function handleReject(submissionId) {
    rejectBackofficeUploadSubmission(submissionId)
      .then((reviewResponse) => {
        removeSubmissionFromList(reviewResponse)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a rifiutare la submission.")
      })
  }

  useEffect(() => {
    getBackofficeUploadSubmissionsByStatus("SUBMITTED")
      .then((data) => {
        setSubmissions(data.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare le submission in attesa.")
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

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Upload Submissions</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
          Revisiona le immagini inviate dagli utenti confrontandole con il riferimento richiesto.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        {submissions.map((submission) => (
          <article key={submission.submissionId} className="rounded-2xl border border-border-soft bg-surface p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted">Experience</p>

                <h2 className="mt-2 font-serif text-2xl text-ink">{submission.experienceTitle}</h2>

                <p className="mt-3 text-sm text-muted">
                  Submitted by <span className="text-ink">{submission.username}</span>
                </p>

                <p className="mt-1 text-xs text-muted">{submission.submittedAt}</p>
              </div>

              <span className={submission.status === "APPROVED" ? "text-accent" : "text-muted"}>{submission.status}</span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border-soft bg-canvas p-5">
                <p className="text-sm tracking-[0.2em] text-accent">Reference</p>

                <p className="mt-4 text-sm leading-6 text-muted">{submission.validationHint || "Nessuna nota di validazione presente."}</p>

                <div className="mt-5">
                  {submission.referenceImageUrl ? (
                    <a
                      href={submission.referenceImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
                    >
                      Open reference image
                    </a>
                  ) : (
                    <p className="text-sm text-muted">Nessuna immagine di riferimento.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-canvas p-5">
                <p className="text-sm tracking-[0.2em] text-accent">User upload</p>

                <p className="mt-4 text-sm leading-6 text-muted">Immagine inviata dall'utente per completare l'esperienza.</p>

                <div className="mt-5">
                  {submission.imageUrl ? (
                    <a
                      href={submission.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
                    >
                      Open uploaded image
                    </a>
                  ) : (
                    <p className="text-sm text-muted">Nessuna immagine caricata.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {submission.status === "SUBMITTED" ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleApprove(submission.submissionId)}
                    className="rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(submission.submissionId)}
                    className="rounded-full border border-border-soft px-5 py-3 text-sm text-muted transition hover:border-accent-soft hover:text-ink"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span className="text-sm text-muted">Reviewed</span>
              )}
            </div>
          </article>
        ))}

        {submissions.length === 0 && (
          <div className="rounded-2xl border border-border-soft bg-surface p-8 text-center text-muted">Nessuna submission upload presente.</div>
        )}
      </div>
    </section>
  )
}

export default UploadSubmissionsList
