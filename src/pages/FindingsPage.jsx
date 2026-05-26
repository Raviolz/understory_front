import { useEffect, useMemo, useState } from "react"
import { getMyBookings, getMyRewards } from "../api/meApi"
import FindingPass from "../components/findings/FindingPass"
import MyBookingsList from "../components/findings/MyBookingsList"

function FindingsPage() {
  const [rewards, setRewards] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedReward, setSelectedReward] = useState(null)
  const [activeView, setActiveView] = useState("recovered")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    Promise.all([getMyRewards({ size: 50 }), getMyBookings({ size: 50 })])
      .then(([rewardsData, bookingsData]) => {
        setRewards(rewardsData.content ?? [])
        setBookings(bookingsData.content ?? [])
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare i tuoi findings.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const sortedRewards = useMemo(() => {
    return [...rewards].sort((firstReward, secondReward) => {
      return new Date(secondReward.unlockedAt) - new Date(firstReward.unlockedAt)
    })
  }, [rewards])

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((firstBooking, secondBooking) => {
      return new Date(secondBooking.bookingDate) - new Date(firstBooking.bookingDate)
    })
  }, [bookings])

  function handleRequestBooking(reward) {
    setSelectedReward(reward)
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento findings...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <p className="text-sm tracking-[0.25em] text-accent">RECOVERED FINDINGS</p>

      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Access Archive</h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
        A collection of access passes unlocked through exploration. Each finding connects a hidden story to a real place.
      </p>

      <div className="mt-8 inline-flex rounded-full border border-border-soft bg-surface p-1">
        <button
          type="button"
          onClick={() => setActiveView("recovered")}
          className={
            activeView === "recovered"
              ? "rounded-full bg-accent px-5 py-2 text-sm text-canvas"
              : "rounded-full px-5 py-2 text-sm text-muted transition hover:text-ink"
          }
        >
          Recovered {sortedRewards.length}
        </button>

        <button
          type="button"
          onClick={() => setActiveView("scheduled")}
          className={
            activeView === "scheduled"
              ? "rounded-full bg-accent px-5 py-2 text-sm text-canvas"
              : "rounded-full px-5 py-2 text-sm text-muted transition hover:text-ink"
          }
        >
          Scheduled {sortedBookings.length}
        </button>
      </div>

      {activeView === "recovered" && (
        <>
          {selectedReward && (
            <div className="mt-8 rounded-3xl border border-accent-soft bg-surface p-5">
              <p className="text-sm text-accent">Selected finding</p>
              <p className="mt-2 font-serif text-2xl text-ink">{selectedReward.rewardTitle}</p>
              <p className="mt-1 text-sm text-muted">Booking form coming next for {selectedReward.businessName}.</p>
            </div>
          )}

          {sortedRewards.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
              <p className="text-muted">Non hai ancora sbloccato nessun finding.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 xl:grid-cols-2">
              {sortedRewards.map((reward) => (
                <FindingPass key={reward.userRewardId} reward={reward} onRequestBooking={handleRequestBooking} />
              ))}
            </div>
          )}
        </>
      )}

      {activeView === "scheduled" && (
        <div className="mt-10">
          <MyBookingsList bookings={sortedBookings} />
        </div>
      )}
    </section>
  )
}

export default FindingsPage
