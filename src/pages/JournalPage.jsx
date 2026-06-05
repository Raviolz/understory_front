import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getMyJournal, updateMyProgressNote } from "../api/meApi"
import JournalEntryCard from "../components/journal/JournalEntryCard"
import Loader from "../components/ui/Loader"

function JournalPage() {
  const [entries, setEntries] = useState([])
  const [noteDrafts, setNoteDrafts] = useState({})
  const [savingNoteId, setSavingNoteId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    getMyJournal({ size: 50 })
      .then((data) => {
        if (ignore) return

        const journalEntries = data.content ?? []

        setEntries(journalEntries)

        const initialDrafts = journalEntries.reduce((drafts, entry) => {
          drafts[entry.progressId] = entry.userNote || ""
          return drafts
        }, {})

        setNoteDrafts(initialDrafts)
      })
      .catch((error) => {
        if (ignore) return

        console.error(error)
        setError("Non riesco a caricare il journal.")
      })
      .finally(() => {
        if (ignore) return

        setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const sortedEntries = useMemo(() => {
    return [...entries].sort((firstEntry, secondEntry) => {
      return new Date(secondEntry.completedAt) - new Date(firstEntry.completedAt)
    })
  }, [entries])

  function handleNoteChange(progressId, value) {
    setNoteDrafts((currentDrafts) => ({
      ...currentDrafts,
      [progressId]: value,
    }))
  }

  function handleSaveNote(entry) {
    setSavingNoteId(entry.progressId)
    setError(null)

    return updateMyProgressNote(entry.progressId, noteDrafts[entry.progressId] || "")
      .then((updatedProgress) => {
        setEntries((currentEntries) =>
          currentEntries.map((currentEntry) =>
            currentEntry.progressId === entry.progressId
              ? {
                  ...currentEntry,
                  userNote: updatedProgress.userNote,
                }
              : currentEntry,
          ),
        )
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a salvare la nota.")
        throw error
      })
      .finally(() => {
        setSavingNoteId(null)
      })
  }

  const pageHeader = (
    <header className="journal-page__header">
      <div className="journal-page__header-copy">
        <p className="journal-page__eyebrow">Personal archive</p>

        <h1 className="journal-page__title">Archivio personale</h1>

        <p className="journal-page__intro">Appunti di viaggio e tracce raccolte lungo il percorso.</p>
      </div>

      <Link to="/atlas" className="journal-page__atlas-link">
        Atlante
      </Link>
    </header>
  )

  if (isLoading) {
    return (
      <section className="journal-page">
        <div className="journal-page__panel">
          <div className="mx-auto max-w-7xl">
            {pageHeader}

            <div className="mt-10 rounded-3xl border border-border-soft bg-surface p-6">
              <Loader label="Caricamento journal…" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="journal-page">
        <div className="journal-page__panel">
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
    <section className="journal-page">
      <div className="journal-page__panel">
        <div className="mx-auto max-w-7xl">
          {pageHeader}

          {sortedEntries.length === 0 ? (
            <div className="journal-page__empty mt-10">
              <p className="text-muted">Non hai ancora completato nessuna esperienza.</p>
            </div>
          ) : (
            <div className="journal-page__grid">
              {sortedEntries.map((entry) => (
                <JournalEntryCard
                  key={entry.progressId}
                  entry={entry}
                  noteValue={noteDrafts[entry.progressId] || ""}
                  isSaving={savingNoteId === entry.progressId}
                  onNoteChange={handleNoteChange}
                  onSaveNote={handleSaveNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default JournalPage
