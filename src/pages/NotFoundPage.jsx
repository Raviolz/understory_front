import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center px-5 text-center">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm tracking-[0.35em] text-accent">Understory Archive</p>

        <h1 className="mb-4 font-serif text-3xl text-ink md:text-4xl">Luogo non mappato</h1>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-muted md:text-base">
          Hai raggiunto un punto che non compare nei nostri archivi. Forse è solo un errore. O forse non era ancora il momento di trovarlo.
        </p>

        <Link
          to="/explore"
          className="inline-flex rounded-full border border-accent-soft px-6 py-3 text-sm tracking-[0.14em] text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
        >
          Torna ad esplorare sentieri sicuri
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
