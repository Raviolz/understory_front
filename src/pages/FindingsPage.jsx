import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getMyBookings, getMyRewards } from "../api/meApi"
import FindingPass from "../components/findings/FindingPass"
import MyBookingsList from "../components/findings/MyBookingsList"
import Loader from "../components/ui/Loader"

function FindingsPage() {
  const [rewards, setRewards] = useState([])
  const [bookings, setBookings] = useState([])
  const [activeView, setActiveView] = useState("recovered")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    Promise.all([getMyRewards({ size: 50 }), getMyBookings({ size: 50 })])
      .then(([rewardsData, bookingsData]) => {
        if (ignore) {
          return
        }

        setRewards(rewardsData.content ?? [])
        setBookings(bookingsData.content ?? [])
      })
      .catch((error) => {
        if (ignore) {
          return
        }

        console.error(error)
        setError("Non riesco a caricare i tuoi findings.")
      })
      .finally(() => {
        if (ignore) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
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

  function handleBookingCreated(createdBooking) {
    setBookings((currentBookings) => [createdBooking, ...currentBookings])
  }

  if (isLoading) {
    return (
      <section>
        <p className="text-sm tracking-[0.25em] text-accent">RECOVERED FINDINGS</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Access Archive</h1>

        <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
          <Loader label="Caricamento findings…" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <p className="text-sm tracking-[0.25em] text-accent">RECOVERED FINDINGS</p>

        <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Access Archive</h1>

        <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
          <p className="text-arcane">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="findings-page">
      <div className="findings-page__panel">
        <div className="mx-auto max-w-7xl">
          <h1 className="mt-4 font-serif text-4xl text-accent md:text-5xl">Accessi recuperati</h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">Pass, inviti e opportunità sbloccati durante l'esplorazione.</p>

          <div className="findings-page__controls">
            <div className="inline-flex rounded-full border border-border-soft bg-surface p-1">
              <button
                type="button"
                onClick={() => setActiveView("recovered")}
                className={
                  activeView === "recovered"
                    ? "rounded-full bg-accent px-5 py-2 text-sm text-canvas"
                    : "rounded-full px-5 py-2 text-sm text-muted transition hover:text-ink"
                }
              >
                Recuperati {sortedRewards.length}
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
                Archiviati {sortedBookings.length}
              </button>
            </div>

            <Link to="/local-shops" className="findings-page__shops-link">
              Botteghe scoperte
            </Link>
          </div>

          {activeView === "recovered" && (
            <>
              {sortedRewards.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
                  <p className="text-muted">Non hai ancora sbloccato nessun accesso.</p>
                </div>
              ) : (
                <div className="mt-10 grid items-start gap-6 xl:grid-cols-2">
                  {sortedRewards.map((reward) => (
                    <FindingPass key={reward.userRewardId} reward={reward} onBookingCreated={handleBookingCreated} />
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
        </div>
      </div>
    </section>
  )
}

export default FindingsPage
