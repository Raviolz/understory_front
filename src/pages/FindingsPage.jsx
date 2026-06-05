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

  const pageHeader = (
    <header className="findings-page__header">
      <p className="findings-page__eyebrow">PASSE-PARTOUT</p>

      <h1 className="findings-page__title">Accessi recuperati</h1>

      <p className="findings-page__intro"> Biglietti, opportunità e inviti sbloccati durante l'esplorazione.</p>
    </header>
  )

  if (isLoading) {
    return (
      <section className="findings-page">
        <div className="findings-page__panel">
          <div className="mx-auto max-w-7xl">
            {pageHeader}

            <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
              <Loader label="Recuperando i biglietti…" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="findings-page">
        <div className="findings-page__panel">
          <div className="mx-auto max-w-7xl">
            {pageHeader}

            <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
              <p className="text-arcane">{error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="findings-page">
      <div className="findings-page__panel">
        <div className="mx-auto max-w-7xl">
          {pageHeader}

          <div className="findings-page__controls">
            <div className="findings-page__tabs">
              <button
                type="button"
                onClick={() => setActiveView("recovered")}
                className={activeView === "recovered" ? "findings-page__tab findings-page__tab--active" : "findings-page__tab"}
              >
                Recuperati {sortedRewards.length}
              </button>

              <button
                type="button"
                onClick={() => setActiveView("scheduled")}
                className={activeView === "scheduled" ? "findings-page__tab findings-page__tab--active" : "findings-page__tab"}
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
                <div className="mt-10 grid items-start gap-20 xl:grid-cols-2">
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
