function MyBookingsList({ bookings = [] }) {
  if (bookings.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-border-soft bg-surface p-5">
        <p className="text-sm text-muted">Non hai ancora richiesto nessuna prenotazione.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-4">
      {bookings.map((booking) => {
        const bookingDate = booking.bookingDate
          ? new Date(booking.bookingDate).toLocaleString("it-IT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Data non disponibile"

        return (
          <article key={booking.bookingId} className="rounded-3xl border border-border-soft bg-surface p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent">{booking.cityName}</p>

                <h3 className="mt-2 font-serif text-2xl text-ink">{booking.rewardTitle}</h3>

                <p className="mt-1 text-sm text-muted">{booking.businessName}</p>
              </div>

              <span className="w-fit rounded-full border border-border-soft px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                {booking.status}
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-muted md:grid-cols-2">
              <p>
                <span className="text-ink">Date:</span> {bookingDate}
              </p>

              <p>
                <span className="text-ink">People:</span> {booking.peopleCount}
              </p>
            </div>

            {booking.notes && <p className="mt-4 text-sm leading-6 text-muted">{booking.notes}</p>}
          </article>
        )
      })}
    </div>
  )
}

export default MyBookingsList
