import { useEffect, useMemo, useState } from "react"
import { confirmBooking, getBookings, getBookingsByStatus, rejectBooking } from "../../../api/backofficeApi"
import BookingList from "../../../components/backoffice/bookings/BookingList"

const bookingStatuses = ["ALL", "PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"]

function BoBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [updatingBookingId, setUpdatingBookingId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    const request = statusFilter === "ALL" ? getBookings({ size: 50 }) : getBookingsByStatus(statusFilter, { size: 50 })

    request
      .then((data) => {
        if (ignore) return
        setBookings(data.content ?? [])
      })
      .catch((error) => {
        if (ignore) return
        console.error(error)
        setError("Unable to load bookings.")
      })
      .finally(() => {
        if (ignore) return
        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [statusFilter])

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((firstBooking, secondBooking) => {
      return new Date(secondBooking.bookingDate) - new Date(firstBooking.bookingDate)
    })
  }, [bookings])

  function replaceBooking(updatedBooking) {
    setBookings((currentBookings) => currentBookings.map((booking) => (booking.bookingId === updatedBooking.bookingId ? updatedBooking : booking)))
  }

  function handleConfirm(bookingId) {
    setUpdatingBookingId(bookingId)
    setError(null)

    confirmBooking(bookingId)
      .then((updatedBooking) => {
        replaceBooking(updatedBooking)
      })
      .catch((error) => {
        console.error(error)
        setError("Unable to confirm booking.")
      })
      .finally(() => {
        setUpdatingBookingId(null)
      })
  }

  function handleReject(bookingId) {
    setUpdatingBookingId(bookingId)
    setError(null)

    rejectBooking(bookingId)
      .then((updatedBooking) => {
        replaceBooking(updatedBooking)
      })
      .catch((error) => {
        console.error(error)
        setError("Unable to reject booking.")
      })
      .finally(() => {
        setUpdatingBookingId(null)
      })
  }

  if (isLoading) {
    return <p className="text-muted">Loading bookings...</p>
  }

  return (
    <section>
      <p className="text-sm tracking-[0.25em] text-accent">BACKOFFICE</p>

      <h1 className="mt-4 font-serif text-4xl text-ink">Bookings</h1>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Review user access requests and confirm or reject pending bookings.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        {bookingStatuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              setStatusFilter(status)
              setIsLoading(true)
              setError(null)
            }}
            className={
              statusFilter === status
                ? "rounded-full bg-accent px-4 py-2 text-sm text-canvas"
                : "rounded-full border border-border-soft px-4 py-2 text-sm text-muted transition hover:border-accent-soft hover:text-ink"
            }
          >
            {status}
          </button>
        ))}
      </div>

      {error && <p className="mt-5 text-sm text-arcane">{error}</p>}

      <BookingList bookings={sortedBookings} onConfirm={handleConfirm} onReject={handleReject} isUpdatingId={updatingBookingId} />
    </section>
  )
}

export default BoBookingsPage
