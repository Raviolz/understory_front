import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createBackofficeReward, getBackofficeCities, getBackofficeLocalBusinesses } from "../../../api/backofficeApi"
import RewardForm from "../../../components/backoffice/rewards/RewardForm"

function BoRewardCreatePage() {
  const navigate = useNavigate()

  const [cities, setCities] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getBackofficeCities(), getBackofficeLocalBusinesses()])
      .then(([citiesData, businessesData]) => {
        setCities(citiesData.content || [])
        setBusinesses(businessesData.content || [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare i dati per il form.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  function handleCreate(rewardData) {
    return createBackofficeReward(rewardData).then(() => {
      navigate("/backoffice/rewards")
    })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento form...</p>
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

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create reward</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea una nuova ricompensa collegata a una città e a un’attività locale.</p>
      </div>

      <RewardForm
        cities={cities}
        businesses={businesses}
        submitLabel="Create reward"
        onSubmit={handleCreate}
        onCancel={() => navigate("/backoffice/rewards")}
      />
    </section>
  )
}

export default BoRewardCreatePage
