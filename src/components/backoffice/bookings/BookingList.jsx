function BookingList({ bookings = [], onConfirm, onReject, isUpdatingId }) {
  if (bookings.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-border-soft bg-surface p-6">
        <p className="text-muted">No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border-soft bg-surface">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-border-soft text-xs tracking-[0.18em] text-muted">
          <tr>
            <th className="px-4 py-4">USERr</th>
            <th className="px-4 py-4">REWARDS</th>
            <th className="px-4 py-4">BUSINESS</th>
            <th className="px-4 py-4">DATE</th>
            <th className="px-4 py-4">PEOPLE</th>
            <th className="px-4 py-4">STATUS</th>
            <th className="px-4 py-4">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => {
            const bookingDate = booking.bookingDate
              ? new Date(booking.bookingDate).toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"

            const isPending = booking.status === "PENDING"
            const isUpdating = isUpdatingId === booking.bookingId

            return (
              <tr key={booking.bookingId} className="border-b border-border-soft last:border-b-0">
                <td className="px-4 py-4 text-ink">{booking.username}</td>

                <td className="px-4 py-4">
                  <p className="text-ink">{booking.rewardTitle}</p>
                  {booking.discountCode && <p className="mt-1 text-xs text-muted">{booking.discountCode}</p>}
                </td>

                <td className="px-4 py-4">
                  <p className="text-ink">{booking.businessName}</p>
                  <p className="mt-1 text-xs text-muted">{booking.cityName}</p>
                </td>

                <td className="px-4 py-4 text-muted">{bookingDate}</td>

                <td className="px-4 py-4 text-muted">{booking.peopleCount}</td>

                <td className="px-4 py-4">
                  <span className="rounded-full border border-border-soft px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted">{booking.status}</span>
                </td>

                <td className="px-4 py-4">
                  {isPending ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onConfirm(booking.bookingId)}
                        disabled={isUpdating}
                        className="rounded-full border border-accent-soft px-3 py-2 text-xs text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating ? "..." : "Confirm"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onReject(booking.bookingId)}
                        disabled={isUpdating}
                        className="rounded-full border border-border-soft px-3 py-2 text-xs text-muted transition hover:border-arcane hover:text-arcane disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted">No actions</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BookingList
