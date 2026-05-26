import { useEffect, useMemo, useState } from "react"
import { getMyJournal, updateMyProgressNote } from "../api/meApi"
import JournalEntryCard from "../components/journal/JournalEntryCard"

function JournalPage() {
  const [entries, setEntries] = useState([])
  const [noteDrafts, setNoteDrafts] = useState({})
  const [savingNoteId, setSavingNoteId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    getMyJournal({ size: 50 })
      .then((data) => {
        const journalEntries = data.content ?? []

        setEntries(journalEntries)

        const initialDrafts = journalEntries.reduce((drafts, entry) => {
          drafts[entry.progressId] = entry.userNote || ""
          return drafts
        }, {})

        setNoteDrafts(initialDrafts)
      })
      .catch((error) => {
        console.error(error)
        setError("Non riesco a caricare il journal.")
      })
      .finally(() => {
        setIsLoading(false)
      })
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

    updateMyProgressNote(entry.progressId, noteDrafts[entry.progressId] || "")
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
      })
      .finally(() => {
        setSavingNoteId(null)
      })
  }

  if (isLoading) {
    return <p className="text-muted">Caricamento journal...</p>
  }

  if (error) {
    return <p className="text-arcane">{error}</p>
  }

  return (
    <section>
      <p className="text-sm tracking-[0.25em] text-accent">PERSONAL ARCHIVE</p>

      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">Journal</h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
        A collection of the places you uncovered, the traces you followed, and the notes you chose to keep.
      </p>

      {sortedEntries.length === 0 ? (
        <div className="mt-10">
          <p className="text-muted">Non hai ancora completato nessuna esperienza.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(420px,520px))] justify-center gap-x-20 gap-y-32 max-[460px]:grid-cols-[minmax(0,1fr)]">
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
    </section>
  )
}

export default JournalPage
