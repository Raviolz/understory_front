import { Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { uploadMyAvatar } from "../api/authApi"
import { setCurrentUser } from "../redux/authSlice"
import { useRef, useState } from "react"

function ProfilePage() {
  const accessToken = useSelector((state) => state.auth.accessToken)
  const currentUser = useSelector((state) => state.auth.currentUser)
  const dispatch = useDispatch()
  const avatarInputRef = useRef(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState(null)

  function handleAvatarUpload(file) {
    if (!file) {
      return
    }

    setIsUploadingAvatar(true)
    setAvatarError(null)

    uploadMyAvatar(file)
      .then((updatedUser) => {
        dispatch(setCurrentUser(updatedUser))
      })
      .catch((error) => {
        console.error(error)
        setAvatarError("Non riesco a caricare l’avatar.")
      })
      .finally(() => {
        setIsUploadingAvatar(false)
      })
  }

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
          <div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="group relative h-24 w-24 overflow-hidden rounded-full border border-border-soft bg-canvas disabled:cursor-not-allowed disabled:opacity-70"
            >
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.username} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm text-muted">No avatar</span>
              )}

              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs text-white opacity-0 transition group-hover:opacity-100">
                {isUploadingAvatar ? "Uploading..." : "Modifica"}
              </span>
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0]
                handleAvatarUpload(file)
                event.target.value = ""
              }}
              className="hidden"
            />

            {avatarError && <p className="mt-2 text-xs text-arcane">{avatarError}</p>}
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
