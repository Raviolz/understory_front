import { useState } from "react"
import BookingRequestForm from "./BookingRequestForm"

function FindingPass({ reward, onBookingCreated }) {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)

  const unlockedDate = reward.unlockedAt
    ? new Date(reward.unlockedAt).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown date"

  const isUnlocked = reward.status === "UNLOCKED"
  const isRedeemed = reward.status === "REDEEMED"

  function handleBookingCreated(createdBooking) {
    setBookingSent(true)
    setIsRequestOpen(false)
    onBookingCreated(createdBooking)
  }

  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-border-soft bg-surface p-5 shadow-sm">
      <div className="absolute right-5 top-5 rounded-full border border-accent-soft px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted">
        {reward.status}
      </div>

      <div className="border-b border-dashed border-border-soft pb-5 pr-28">
        <p className="text-xs tracking-[0.25em] text-accent">ARCHIVE ACCESS</p>

        <h2 className="mt-4 font-serif text-2xl leading-tight text-ink">{reward.rewardTitle}</h2>

        <p className="mt-2 text-sm text-muted">{reward.cityName}</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_150px]">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted">ACCESS POINT</p>
          <p className="mt-2 font-serif text-xl text-ink">{reward.businessName}</p>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">{reward.rewardDescription}</p>
        </div>

        <div className="rounded-2xl border border-border-soft bg-canvas p-4">
          <p className="text-[10px] tracking-[0.2em] text-muted">ISSUED</p>
          <p className="mt-2 text-sm text-accent">{unlockedDate}</p>

          <div className="mt-5 border-t border-border-soft pt-4">
            <p className="text-[10px] tracking-[0.2em] text-muted">TYPE</p>
            <p className="mt-2 text-sm text-ink">{reward.rewardType}</p>
          </div>
        </div>
      </div>

      {reward.discountCode && (
        <div className="mt-5 rounded-2xl border border-dashed border-accent-soft bg-canvas px-4 py-3">
          <p className="text-[10px] tracking-[0.2em] text-muted">ACCESS CODE</p>
          <p className="mt-2 font-mono text-sm text-accent">{reward.discountCode}</p>
        </div>
      )}

      {bookingSent && (
        <div className="mt-5 rounded-2xl border border-accent-soft bg-canvas p-4">
          <p className="text-sm text-accent">Request sent.</p>
          <p className="mt-2 text-sm leading-6 text-muted">Your access request is now pending confirmation.</p>
        </div>
      )}

      {isRequestOpen && <BookingRequestForm reward={reward} onBookingCreated={handleBookingCreated} onCancel={() => setIsRequestOpen(false)} />}

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs leading-5 text-muted">
          {isUnlocked && !bookingSent && "Unlocked through city exploration."}
          {isUnlocked && bookingSent && "Request pending confirmation."}
          {isRedeemed && "This access has already been used."}
          {!isUnlocked && !isRedeemed && "This access is no longer available."}
        </p>

        {isUnlocked && !bookingSent && (
          <button
            type="button"
            onClick={() => setIsRequestOpen((currentValue) => !currentValue)}
            className="shrink-0 rounded-full border border-accent-soft px-5 py-2 text-sm text-accent transition hover:border-accent hover:bg-accent hover:text-canvas"
          >
            {isRequestOpen ? "Close request" : "Request booking"}
          </button>
        )}
      </div>
    </article>
  )
}

export default FindingPass
