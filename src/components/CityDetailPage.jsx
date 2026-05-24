import { Link, useParams } from "react-router-dom"

function CityDetailPage() {
  const { cityId } = useParams()

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-ink">
      <Link to="/" className="text-sm text-muted hover:text-accent">
        ← Back to globe
      </Link>

      <section className="mt-10">
        <p className="text-sm uppercase tracking-[0.25em] text-accent">City archive</p>

        <h1 className="mt-4 font-serif text-4xl md:text-5xl">City detail page</h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted md:text-base">PER ORA IL VUOTO</p>

        <p className="mt-4 text-xs text-muted">City ID: {cityId}</p>
      </section>
    </main>
  )
}

export default CityDetailPage
