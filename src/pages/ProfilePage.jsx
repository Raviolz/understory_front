import { Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getMyCityKnowledge, uploadMyAvatar, updateMyProfile } from "../api/authApi"
import { setCurrentUser } from "../redux/authSlice"
import { useEffect, useRef, useState } from "react"
import EditProfileForm from "../components/profile/EditProfileForm"
import Loader from "../components/ui/Loader"
import profilePaperImage from "../assets/profile/paper_profile.jpg"

function clampFillPercent(percentage) {
  const value = Number(percentage) || 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

function vialPaletteFromIndex(index) {
  const palettes = ["amber", "violet", "emerald", "rose", "azure", "gold"]
  return palettes[index % palettes.length]
}

function vialToneFromCompletion(percentage) {
  const fill = clampFillPercent(percentage)

  if (fill >= 100) return "complete"
  if (fill >= 66) return "mature"
  if (fill >= 33) return "forming"
  if (fill > 0) return "awakening"

  return "dormant"
}

function formatRole(role) {
  if (role === "SUPER_ADMIN") return "Custode"
  if (role === "ADMIN") return "Archivista"
  return "Esploratore"
}

function ProfilePage() {
  const accessToken = useSelector((state) => state.auth.accessToken)
  const currentUser = useSelector((state) => state.auth.currentUser)
  const dispatch = useDispatch()
  const avatarInputRef = useRef(null)

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState(null)
  const [cityKnowledge, setCityKnowledge] = useState([])
  const [isLoadingCityKnowledge, setIsLoadingCityKnowledge] = useState(true)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileEditError, setProfileEditError] = useState(null)
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  useEffect(() => {
    if (!currentUser) return

    setIsLoadingCityKnowledge(true)

    getMyCityKnowledge()
      .then((data) => {
        setCityKnowledge(data)
      })
      .catch((error) => {
        console.error(error)
        setCityKnowledge([])
      })
      .finally(() => {
        setIsLoadingCityKnowledge(false)
      })
  }, [currentUser])

  function handleAvatarUpload(file) {
    if (!file) return

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

  function handleProfileUpdate(profileData) {
    setIsSavingProfile(true)
    setProfileEditError(null)

    updateMyProfile(profileData)
      .then((updatedUser) => {
        dispatch(setCurrentUser(updatedUser))
        setIsEditOpen(false)
      })
      .catch((error) => {
        console.error(error)
        setProfileEditError("Non riesco ad aggiornare il fascicolo.")
      })
      .finally(() => {
        setIsSavingProfile(false)
      })
  }

  if (accessToken && !currentUser) {
    return <Loader label="Caricamento fascicolo…" />
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const moniker = (currentUser.username || "esploratore").toUpperCase()

  return (
    <section className="profile-dossier" aria-labelledby="profile-dossier-title">
      <div className="profile-dossier__desk">
        {!isDossierOpen ? (
          <button type="button" className="profile-dossier__cover" onClick={() => setIsDossierOpen(true)} aria-label="Apri fascicolo personale">
            <span className="profile-dossier__cover-paper" style={{ backgroundImage: `url(${profilePaperImage})` }}>
              <span className="profile-dossier__cover-stamp">Confidential</span>
              <span className="profile-dossier__cover-code">Fascicolo N. {String(currentUser.level ?? 1).padStart(2, "0")}</span>
            </span>

            <span className="profile-dossier__cover-label">Apri fascicolo →</span>
          </button>
        ) : (
          <div className="profile-dossier__folio">
            <span className="profile-dossier__star profile-dossier__star--tl" aria-hidden="true">
              ✦
            </span>

            <span className="profile-dossier__star profile-dossier__star--tr" aria-hidden="true">
              ✦
            </span>

            <header className="profile-dossier__header">
              <p className="profile-dossier__kicker">Fascicolo personale</p>
              <p className="profile-dossier__folio-id">Fascicolo N. {String(currentUser.level ?? 1).padStart(2, "0")}</p>
            </header>

            <div className="profile-dossier__spread">
              <div className="profile-dossier__body">
                <div className="profile-seal">
                  <span className="profile-seal__ring profile-seal__ring--outer" aria-hidden="true" />
                  <span className="profile-seal__ring profile-seal__ring--mid" aria-hidden="true" />
                  <span className="profile-seal__ring profile-seal__ring--inner" aria-hidden="true" />
                  <span className="profile-seal__greek" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="profile-seal__portrait"
                    aria-label="Modifica ritratto del fascicolo"
                  >
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="" className="profile-seal__image" />
                    ) : (
                      <span className="profile-seal__void" />
                    )}

                    <span className="profile-seal__veil">{isUploadingAvatar ? "…" : "Ritratto"}</span>
                  </button>
                </div>

                <p className="profile-dossier__moniker">{moniker}</p>

                <h1 id="profile-dossier-title" className="profile-dossier__ledger-title">
                  L&apos;opera prosegue nel silenzio
                </h1>

                <div className="profile-dossier__divider" aria-hidden="true">
                  <span className="profile-dossier__divider-line" />
                  <span className="profile-dossier__divider-gem">◆</span>
                  <span className="profile-dossier__divider-line" />
                </div>

                <p className="profile-dossier__name">
                  {currentUser.name} {currentUser.surname}
                </p>

                <p className="profile-dossier__meta">{currentUser.email}</p>

                <div className="profile-dossier__registro">
                  <div className="profile-dossier__field">
                    <span>Ruolo</span>
                    <strong>{formatRole(currentUser.role)}</strong>
                  </div>

                  <div className="profile-dossier__field">
                    <span>Cerchio</span>
                    <strong>{currentUser.level ?? 0}</strong>
                  </div>

                  <div className="profile-dossier__field">
                    <span>Intuizioni</span>
                    <strong>{currentUser.xp ?? 0}</strong>
                  </div>
                </div>

                <ProfileCityKnowledge cities={cityKnowledge} isLoading={isLoadingCityKnowledge} />

                <div className="profile-dossier__actions">
                  <button type="button" className="profile-dossier__edit-note" onClick={() => setIsEditOpen((value) => !value)}>
                    {isEditOpen ? "Chiudi modifica ↑" : "Aggiorna fascicolo →"}
                  </button>
                </div>

                {isEditOpen && (
                  <EditProfileForm
                    currentUser={currentUser}
                    isSaving={isSavingProfile}
                    error={profileEditError}
                    onSubmit={handleProfileUpdate}
                    onCancel={() => {
                      setIsEditOpen(false)
                      setProfileEditError(null)
                    }}
                  />
                )}

                {avatarError && <p className="profile-dossier__error">{avatarError}</p>}
              </div>
            </div>

            <footer className="profile-dossier__footer">
              <p className="profile-dossier__note"> — Annotazione riservata — </p>
            </footer>
          </div>
        )}
      </div>

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
    </section>
  )
}

function ProfileCityKnowledge({ cities, isLoading }) {
  const vialsRef = useRef(null)

  function scrollVials(direction) {
    vialsRef.current?.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    })
  }

  if (isLoading) {
    return <Loader label="Distillazione sapere…" />
  }

  if (cities.length === 0) {
    return <p className="profile-city-knowledge__empty">Nessuna città distillata.</p>
  }

  return (
    <section className="profile-city-knowledge" aria-labelledby="profile-city-knowledge-title">
      <p id="profile-city-knowledge-title" className="profile-city-knowledge__title">
        Ampolle del sapere
      </p>

      <p className="profile-city-knowledge__intro">Ogni ampolla raccoglie la parte di città che hai già riportato alla luce.</p>

      <div className="profile-city-knowledge__carousel">
        <button type="button" className="profile-city-knowledge__arrow" onClick={() => scrollVials("left")} aria-label="Scorri ampolle a sinistra">
          ←
        </button>

        <ul ref={vialsRef} className="profile-city-knowledge__grid">
          {cities.map((city, index) => {
            const fill = clampFillPercent(city.percentage)
            const tone = vialToneFromCompletion(fill)
            const palette = vialPaletteFromIndex(index)

            return (
              <li key={city.cityId} className="profile-city-knowledge__item">
                <article
                  className={`profile-ampoule profile-ampoule--city profile-ampoule--${tone} profile-ampoule--${palette}`}
                  aria-label={`${city.cityName}: ${fill}%, ${city.completedExperiences}/${city.totalExperiences}`}
                >
                  <p className="profile-ampoule__label">{city.cityName}</p>

                  <div className="profile-ampoule__vessel">
                    <div className="profile-ampoule__bulb">
                      <div className="profile-ampoule__fill" style={{ height: `${fill}%` }} />

                      {fill > 0 && <div className="profile-ampoule__meniscus" style={{ bottom: `${fill}%` }} aria-hidden="true" />}
                    </div>
                  </div>

                  <p className="profile-ampoule__caption">
                    <span className="profile-ampoule__value">{fill}%</span>
                    <span className="profile-ampoule__sep"> · </span>
                    {city.completedExperiences}/{city.totalExperiences}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>

        <button type="button" className="profile-city-knowledge__arrow" onClick={() => scrollVials("right")} aria-label="Scorri ampolle a destra">
          →
        </button>
      </div>
    </section>
  )
}

export default ProfilePage
