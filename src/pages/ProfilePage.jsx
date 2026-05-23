import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

function ProfilePage() {
  const accessToken = useSelector((state) => state.auth.accessToken)
  const currentUser = useSelector((state) => state.auth.currentUser)

  if (accessToken && !currentUser) {
    return <p className="text-muted">Caricamento profilo...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm tracking-[0.25em] text-accent">Archivio personale</p>

      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">{currentUser.username}</h1>

      <div className="mt-8 rounded-3xl border border-border-soft bg-surface p-6 md:p-8">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-accent-soft bg-surface-soft">
            {currentUser.avatarUrl && <img src={currentUser.avatarUrl} alt={currentUser.username} className="h-full w-full object-cover" />}
          </div>

          <div>
            <h2 className="font-serif text-2xl text-ink">
              {currentUser.name} {currentUser.surname}
            </h2>

            <p className="mt-1 text-sm text-muted">{currentUser.email}</p>
            <p className="mt-2 text-sm text-arcane">{currentUser.role}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ProfileStat label="Insights" value={currentUser.xp} />
          <ProfileStat label="Circle" value={currentUser.level} />
        </div>
      </div>
    </section>
  )
}

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-canvas p-5">
      <p className="text-sm tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 font-serif text-3xl text-accent">{value}</p>
    </div>
  )
}

export default ProfilePage
