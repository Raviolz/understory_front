import { useState } from "react"
import BookingRequestForm from "./BookingRequestForm"

function FindingPass({ reward, onBookingCreated }) {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)

  function formatDate(dateValue) {
    if (!dateValue) return "Data sconosciuta"

    return new Date(dateValue).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const unlockedDate = formatDate(reward.unlockedAt)
  const validFromDate = formatDate(reward.validFrom || reward.unlockedAt)
  const validUntilDate = reward.validUntil ? formatDate(reward.validUntil) : null

  const isUnlocked = reward.status === "UNLOCKED"
  const isRedeemed = reward.status === "REDEEMED"
  const canShowCode = isRedeemed && reward.discountCode

  const ticketClassName = isRedeemed ? "access-ticket access-ticket--redeemed" : "access-ticket"

  function handleBookingCreated(createdBooking) {
    setBookingSent(true)
    setIsRequestOpen(false)
    onBookingCreated(createdBooking)
  }

  return (
    <article className={ticketClassName}>
      <aside className="access-ticket__stub">
        <span className={isRedeemed ? "access-ticket__stamp" : "access-ticket__stamp access-ticket__stamp--valid"}>{isRedeemed ? "Validato" : "Valido"}</span>

        <span className="access-ticket__number">N° {String(reward.userRewardId || "000000").slice(-6)}</span>

        <span className="access-ticket__date">{unlockedDate}</span>
      </aside>

      <div className="access-ticket__body">
        <header className="access-ticket__header">
          <div>
            <p className="access-ticket__kicker">Biglietto di accesso</p>
            <h2 className="access-ticket__title">{reward.rewardTitle}</h2>
          </div>

          <div className="access-ticket__meta">
            <p>{reward.cityName}</p>
            <p>{reward.rewardType}</p>
          </div>
        </header>

        <div className="access-ticket__main">
          <div>
            <p className="access-ticket__label">Destinazione</p>
            <p className="access-ticket__place">{reward.businessName}</p>

            <p className="access-ticket__desc">{reward.rewardDescription}</p>
          </div>

          <div className="access-ticket__box">
            <p className="access-ticket__label">Valido da / a</p>

            <p className="access-ticket__code">
              {validFromDate}
              {validUntilDate && (
                <>
                  <br />
                  {validUntilDate}
                </>
              )}
            </p>

            <div className="mt-4 border-t border-dashed border-[rgba(90,70,53,0.35)] pt-3">
              <p className="access-ticket__label">Codice</p>
              <p className="access-ticket__code">{canShowCode ? reward.discountCode : "Dopo conferma"}</p>
            </div>
          </div>
        </div>

        {bookingSent && (
          <div className="mt-4 border border-dashed border-[rgba(90,70,53,0.35)] p-3">
            <p className="text-sm text-[#5a4635]">Richiesta inviata.</p>
            <p className="mt-1 text-sm leading-6 text-[#7a6556]">La tua prenotazione è in attesa di conferma.</p>
          </div>
        )}

        {isRequestOpen && <BookingRequestForm reward={reward} onBookingCreated={handleBookingCreated} onCancel={() => setIsRequestOpen(false)} />}

        <footer className="access-ticket__footer">
          <span />

          <div className="access-ticket__footer-action">
            {(bookingSent || isRedeemed || (!isUnlocked && !isRedeemed)) && (
              <p className="access-ticket__note">
                {bookingSent && "Richiesta inviata."}
                {isRedeemed && "Accesso confermato."}
                {!isUnlocked && !isRedeemed && "Accesso non disponibile."}
              </p>
            )}

            {isUnlocked && !bookingSent && (
              <button type="button" onClick={() => setIsRequestOpen((currentValue) => !currentValue)} className="access-ticket__button">
                {isRequestOpen ? "Chiudi" : "Richiedi prenotazione"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </article>
  )
}

export default FindingPass
