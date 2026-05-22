import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

function BackofficePage() {
  const currentUser = useSelector((state) => state.auth.currentUser)
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN"
  return (
    <section>
      <p className="text-sm tracking-[0.25em] text-accent">Backoffice</p>

      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Archivio amministrativo</h1>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">Gestisci contenuti, luoghi, esperienze, attività locali e ricompense.</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <BackofficeSectionCard to="/backoffice/cities" title="Cities" description="Gestisci città pubblicate, bozze e contenuti geografici principali." />

        <BackofficeSectionCard to="/backoffice/points" title="Points of Interest" description="Gestisci i luoghi fisici collegati alle città." />

        <BackofficeSectionCard
          to="/backoffice/experience-categories"
          title="Experience Categories"
          description="Gestisci le categorie narrative usate per classificare le esperienze."
        />

        <BackofficeSectionCard to="/backoffice/experiences" title="Experiences" description="Gestisci esperienze narrative, difficoltà, XP e categorie." />

        <BackofficeSectionCard to="/backoffice/games" title="Games" description="Gestisci quiz e task di upload collegati alle esperienze." />

        <BackofficeSectionCard
          to="/backoffice/upload-submissions"
          title="Upload Submissions"
          description="Revisiona le immagini inviate dagli utenti per completare le esperienze upload."
        />

        <BackofficeSectionCard
          to="/backoffice/business-categories"
          title="Business Categories"
          description="Gestisci le categorie usate per classificare le attività locali."
        />

        <BackofficeSectionCard
          to="/backoffice/local-businesses"
          title="Local Businesses"
          description="Gestisci attività locali, indirizzi, città e partnership."
        />

        <BackofficeSectionCard to="/backoffice/rewards" title="Rewards" description="Gestisci ricompense, codici, validità e contenuti sbloccabili." />
        {isSuperAdmin && <BackofficeSectionCard to="/backoffice/users" title="Users" description="Gestisci utenti e ruoli amministrativi." />}
      </div>
    </section>
  )
}

function BackofficeSectionCard({ to, title, description }) {
  return (
    <Link to={to} className="block rounded-2xl border border-border-soft bg-surface p-5 transition hover:border-accent-soft hover:bg-surface-soft">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>

      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>

      <p className="mt-6 text-sm text-accent">Apri sezione →</p>
    </Link>
  )
}

export default BackofficePage
