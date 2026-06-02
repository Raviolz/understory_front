import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BackofficePagination from "../BackofficePagination"
import { deleteBackofficeReward, getBackofficeRewards, publishBackofficeReward, unpublishBackofficeReward } from "../../../api/backofficeApi"

const PAGE_SIZE = 15

function RewardList() {
  const [rewards, setRewards] = useState([])
  const [pageData, setPageData] = useState(null)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  function handlePageChange(nextPage) {
    if (nextPage === page) {
      return
    }

    setIsLoading(true)
    setError(null)
    setPage(nextPage)
  }

  function handlePublish(rewardId) {
    publishBackofficeReward(rewardId)
      .then((updatedReward) => {
        setRewards((currentRewards) => currentRewards.map((reward) => (reward.id === updatedReward.id ? updatedReward : reward)))
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a pubblicare la ricompensa.")
      })
  }

  function handleUnpublish(rewardId) {
    unpublishBackofficeReward(rewardId)
      .then((updatedReward) => {
        setRewards((currentRewards) => currentRewards.map((reward) => (reward.id === updatedReward.id ? updatedReward : reward)))
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a rimettere la ricompensa in bozza.")
      })
  }

  function handleDelete(rewardId) {
    const confirmed = window.confirm("Eliminare definitivamente questa ricompensa?")

    if (!confirmed) return

    setError(null)

    deleteBackofficeReward(rewardId)
      .then(() => {
        setRewards((currentRewards) => currentRewards.filter((reward) => reward.id !== rewardId))
      })
      .catch((error) => {
        console.error(error)
        setError("Non puoi eliminare questa ricompensa perché è già stata sbloccata da almeno un utente. Usa Unpublish.")
      })
  }

  useEffect(() => {
    let ignore = false

    getBackofficeRewards({ page, size: PAGE_SIZE })
      .then((data) => {
        if (ignore) {
          return
        }

        setPageData(data)
        setRewards(data.content || [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Non riesco a caricare le ricompense.")
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
  }, [page])

  if (isLoading) {
    return <p className="text-muted">Caricamento ricompense...</p>
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

          <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Rewards</h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci ricompense, codici, validità e stato di pubblicazione.</p>
        </div>

        <Link
          to="/backoffice/rewards/new"
          className="inline-flex rounded-full border border-accent-soft px-5 py-3 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Create reward
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border-soft bg-surface">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead className="border-b border-border-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Title</th>
              <th className="px-4 py-3 font-normal">Business</th>
              <th className="px-4 py-3 font-normal">City</th>
              <th className="px-4 py-3 font-normal">Type</th>
              <th className="px-4 py-3 font-normal">Code</th>
              <th className="px-4 py-3 font-normal">Valid from</th>
              <th className="px-4 py-3 font-normal">Valid until</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rewards.map((reward) => (
              <tr key={reward.id} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{reward.title}</td>

                <td className="px-4 py-4 text-muted">{reward.businessName}</td>

                <td className="px-4 py-4 text-muted">{reward.cityName}</td>

                <td className="px-4 py-4 text-muted">{reward.rewardType}</td>

                <td className="px-4 py-4 text-muted">{reward.discountCode || "—"}</td>

                <td className="px-4 py-4 text-muted">{reward.validFrom}</td>

                <td className="px-4 py-4 text-muted">{reward.validUntil}</td>

                <td className="px-4 py-4">
                  <span className={reward.active ? "text-accent" : "text-muted"}>{reward.active ? "Published" : "Draft"}</span>
                </td>

                <td className="w-[180px] px-4 py-4">
                  <div className="bo-actions">
                    <Link to={`/backoffice/rewards/${reward.id}/edit`} className="bo-action bo-action--edit" title="Edit" aria-label="Edit reward">
                      ✎
                    </Link>

                    {reward.active ? (
                      <button
                        type="button"
                        onClick={() => handleUnpublish(reward.id)}
                        className="bo-action bo-action--publish"
                        title="Unpublish"
                        aria-label="Unpublish reward"
                      >
                        ↓
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePublish(reward.id)}
                        className="bo-action bo-action--publish"
                        title="Publish"
                        aria-label="Publish reward"
                      >
                        ↑
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(reward.id)}
                      className="bo-action bo-action--delete"
                      title="Delete"
                      aria-label="Delete reward"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rewards.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-muted">
                  Nessuna ricompensa presente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BackofficePagination pageData={pageData} onPageChange={handlePageChange} />
    </section>
  )
}

export default RewardList
