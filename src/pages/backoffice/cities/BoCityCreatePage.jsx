import { useNavigate } from "react-router-dom"
import { createBackofficeCity } from "../../../api/backofficeApi"
import CityForm from "../../../components/backoffice/cities/CityForm"

function BoCityCreatePage() {
  const navigate = useNavigate()

  function handleCreate(cityData) {
    return createBackofficeCity(cityData).then(() => {
      navigate("/backoffice/cities")
    })
  }

  return (
    <section>
      <button type="button" onClick={() => navigate("/backoffice/cities")} className="text-sm text-muted hover:text-accent">
        ← Cities
      </button>

      <div className="mt-6">
        <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Create city</h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Crea una nuova città dell’archivio. Verrà salvata come bozza.</p>
      </div>

      <CityForm submitLabel="Create city" onSubmit={handleCreate} onCancel={() => navigate("/backoffice/cities")} />
    </section>
  )
}

export default BoCityCreatePage
