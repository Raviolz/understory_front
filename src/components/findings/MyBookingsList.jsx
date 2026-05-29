function MyBookingsList({ bookings = [] }) {
  function formatDate(dateValue, includeTime = false) {
    if (!dateValue) return "Data non disponibile"

    return new Date(dateValue).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(includeTime && {
        hour: "2-digit",
        minute: "2-digit",
      }),
    })
  }

  function isPastDate(dateValue) {
    if (!dateValue) return false
    return new Date(dateValue).getTime() < Date.now()
  }

  function getBookingStatus(booking) {
    const isPast = isPastDate(booking.bookingDate)

    if (booking.status === "CONFIRMED" && isPast) {
      return {
        label: "Archiviato",
        isCut: true,
      }
    }

    if (booking.status === "CONFIRMED") {
      return {
        label: "Validato",
        isCut: true,
      }
    }

    if (booking.status === "PENDING") {
      return {
        label: "In attesa",
        isCut: false,
      }
    }

    if (booking.status === "REJECTED") {
      return {
        label: "Rifiutato",
        isCut: true,
      }
    }

    if (booking.status === "CANCELLED") {
      return {
        label: "Annullato",
        isCut: true,
      }
    }

    return {
      label: booking.status,
      isCut: true,
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-border-soft bg-surface p-5">
        <p className="text-sm text-muted">Non hai ancora accessi archiviati.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid items-start gap-6 xl:grid-cols-2">
      {bookings.map((booking) => {
        const bookingStatus = getBookingStatus(booking)
        const bookingDate = formatDate(booking.bookingDate, true)
        const sideDate = formatDate(booking.bookingDate)
        const ticketClassName = bookingStatus.isCut ? "access-ticket access-ticket--booking access-ticket--redeemed" : "access-ticket access-ticket--booking"

        return (
          <article key={booking.bookingId} className={ticketClassName}>
            <aside className="access-ticket__stub">
              <span className="access-ticket__stamp">{bookingStatus.label}</span>

              <span className="access-ticket__number">N° {String(booking.bookingId || "000000").slice(-6)}</span>

              <span className="access-ticket__date">{sideDate}</span>
            </aside>

            <div className="access-ticket__body">
              <span className="access-ticket__archive-mark" aria-hidden="true">
                🜃
              </span>
              <header className="access-ticket__header">
                <div>
                  <p className="access-ticket__kicker">Biglietto di accesso</p>
                  <h2 className="access-ticket__title">{booking.rewardTitle}</h2>
                </div>

                <div className="access-ticket__meta">
                  <p>{booking.cityName}</p>
                  <p>{booking.rewardType}</p>
                </div>
              </header>
              <div className="access-ticket__main">
                <div>
                  <p className="access-ticket__label">Destinazione</p>
                  <p className="access-ticket__place">{booking.businessName}</p>

                  <p className="access-ticket__desc">{booking.rewardDescription}</p>

                  <div className="mt-5 border-t border-dashed border-[rgba(90,70,53,0.35)] pt-4">
                    <p className="access-ticket__label">Prenotazione</p>
                    <p className="access-ticket__code">
                      {bookingDate}, {booking.peopleCount} {booking.peopleCount === 1 ? "persona" : "persone"}
                    </p>
                  </div>
                </div>

                <div className="access-ticket__box">
                  <p className="access-ticket__label">Nota</p>
                  <p className="access-ticket__box-text">{booking.notes || "Nessuna nota"}</p>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default MyBookingsList
