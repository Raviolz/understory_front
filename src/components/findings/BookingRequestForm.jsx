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
        setError("Non riesco a inviare la richiesta di accesso.")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-dashed border-accent-soft bg-canvas p-4">
      <p className="text-xs tracking-[0.24em] text-accent">ACCESS REQUEST</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`booking-date-${reward.userRewardId}`} className="mb-2 block text-xs tracking-[0.18em] text-muted">
            DATE AND TIME
          </label>

          <input
            id={`booking-date-${reward.userRewardId}`}
            type="datetime-local"
            value={bookingDate}
            onChange={(event) => setBookingDate(event.target.value)}
            className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            required
          />
        </div>

        <div>
          <label htmlFor={`people-count-${reward.userRewardId}`} className="mb-2 block text-xs tracking-[0.18em] text-muted">
            PEOPLE
          </label>

          <input
            id={`people-count-${reward.userRewardId}`}
            type="number"
            min="1"
            value={peopleCount}
            onChange={(event) => setPeopleCount(event.target.value)}
            className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-accent"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={`booking-notes-${reward.userRewardId}`} className="mb-2 block text-xs tracking-[0.18em] text-muted">
          MESSAGE
        </label>

        <textarea
          id={`booking-notes-${reward.userRewardId}`}
          rows="3"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add a note for the local partner..."
          className="w-full resize-none rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm leading-6 text-ink outline-none focus:border-accent"
        />
      </div>

      {error && <p className="mt-4 text-sm text-arcane">{error}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-accent-soft px-5 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send request"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-full border border-border-soft px-5 py-2 text-sm text-muted transition hover:border-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BookingRequestForm
