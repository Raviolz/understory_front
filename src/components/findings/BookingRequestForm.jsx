import { useState } from "react"
import { createMyBooking } from "../../api/meApi"

function BookingRequestForm({ reward, onBookingCreated, onCancel }) {
  const [bookingDate, setBookingDate] = useState("")
  const [peopleCount, setPeopleCount] = useState(1)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)
    setError(null)

    createMyBooking({
      userRewardId: reward.userRewardId,
      bookingDate,
      peopleCount: Number(peopleCount),
      notes: notes || null,
    })
      .then((createdBooking) => {
        onBookingCreated(createdBooking)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a inviare la richiesta di prenotazione.")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="access-ticket__request">
      <p className="access-ticket__label">Richiesta di prenotazione</p>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_7rem]">
        <div>
          <label htmlFor={`booking-date-${reward.userRewardId}`} className="access-ticket__label">
            Data e ora
          </label>

          <input
            id={`booking-date-${reward.userRewardId}`}
            type="datetime-local"
            value={bookingDate}
            onChange={(event) => setBookingDate(event.target.value)}
            className="access-ticket__field"
            required
          />
        </div>

        <div>
          <label htmlFor={`people-count-${reward.userRewardId}`} className="access-ticket__label">
            Persone
          </label>

          <input
            id={`people-count-${reward.userRewardId}`}
            type="number"
            min="1"
            value={peopleCount}
            onChange={(event) => setPeopleCount(event.target.value)}
            className="access-ticket__field"
            required
          />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={`booking-notes-${reward.userRewardId}`} className="access-ticket__label">
          Messaggio
        </label>

        <textarea
          id={`booking-notes-${reward.userRewardId}`}
          rows="3"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Aggiungi una nota per il partner locale..."
          className="access-ticket__field resize-none"
        />
      </div>

      {error && <p className="mt-3 text-sm text-[#8f3a32]">{error}</p>}

      <div className="access-ticket__footer mt-4">
        <span />

        <div className="access-ticket__footer-action">
          <button type="submit" disabled={isSubmitting} className="access-ticket__button disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "Invio..." : "Invia richiesta"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="access-ticket__button access-ticket__button--ghost disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
      </div>
    </form>
  )
}

export default BookingRequestForm
