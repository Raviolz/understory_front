import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBackofficeCities, getBackofficeLocalBusinesses, getBackofficeRewardById, updateBackofficeReward } from "../../../api/backofficeApi"
import RewardForm from "../../../components/backoffice/rewards/RewardForm"

function BoRewardEditPage() {
  const { rewardId } = useParams()
  const navigate = useNavigate()

  const [reward, setReward] = useState(null)
  const [cities, setCities] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeRewardById(rewardId), getBackofficeCities(), getBackofficeLocalBusinesses()])
      .then(([rewardData, citiesData, businessesData]) => {
        setReward(rewardData)
        setCities(citiesData.content || [])
        setBusinesses(businessesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare la ricompensa.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [rewardId])

  function handleUpdate(rewardData) {
    return updateBackofficeReward(rewardId, rewardData).then(() => {
      navigate("/backoffice/rewards")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento ricompensa...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/rewards")} className="text-sm text-muted hover:text-accent">
        ← Rewards
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Edit reward</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Modifica la ricompensa selezionata.</p>
      </div>

      <RewardForm
        cities={cities}
        businesses={businesses}
        initialValues={reward}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate("/backoffice/rewards")}
      />
    </section>
  )
}

export default BoRewardEditPage
