import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

function JournalEntryCard({ entry, noteValue, isSaving, onNoteChange, onSaveNote }) {
  const [isEditingNote, setIsEditingNote] = useState(false)
  const noteInputRef = useRef(null)

  const completedDate = entry.completedAt
    ? new Date(entry.completedAt).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown date"

  useEffect(() => {
    if (!isEditingNote) return

    requestAnimationFrame(() => {
      noteInputRef.current?.focus()
    })
  }, [isEditingNote])

  function handleNoteAction() {
    if (!isEditingNote) {
      setIsEditingNote(true)
      return
    }

    onSaveNote(entry)
      .then(() => {
        setIsEditingNote(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <article className="journal-card relative min-h-[265px] min-w-0 overflow-visible px-4 py-3">
      <span className="journal-card__stamp" aria-hidden="true" />

      <header className="journal-card__header grid grid-cols-[1fr_auto] items-start gap-4 pb-2">
        <div className="min-w-0">
          <h2 className="journal-card__entry-title truncate text-lg leading-tight">{entry.experienceTitle}</h2>

          <p className="journal-card__poi mt-1 truncate text-sm">{entry.pointOfInterestName}</p>
        </div>

        <div className="journal-card__meta shrink-0 text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">{entry.cityName}</p>

          <p className="mt-1 text-xs text-muted">{completedDate}</p>
        </div>
      </header>

      <div className="journal-card__content mt-4 grid grid-cols-[120px_1fr] items-start gap-4 min-[430px]:grid-cols-[150px_1fr]">
        <div className="journal-card__left">
          <div className="journal-card__media overflow-hidden rounded-2xl border bg-canvas">
            {entry.revealImageUrl ? (
              <img src={entry.revealImageUrl} alt={entry.revealTitle} className="h-28 w-full object-cover" />
            ) : (
              <div className="flex h-28 w-full items-center justify-center px-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted">No image</div>
            )}
          </div>

          {entry.experienceId && (
            <Link to={`/experiences/${entry.experienceId}?reveal=true`} className="journal-card__reveal-link">
              ← Per ricordarti
            </Link>
          )}
        </div>

        <div className="min-w-0">
          <p className="journal-card__reveal-title line-clamp-2 text-sm leading-6">{entry.revealTitle}</p>

          <p className="journal-card__excerpt mt-3 line-clamp-4 text-sm leading-4">{entry.journalText || entry.revealText}</p>
        </div>
      </div>

      <div className="journal-note absolute -bottom-24 right-6 z-10 w-[230px] rotate-1 rounded-xl p-4 text-[#21170e] max-[430px]:right-3 max-[430px]:w-[200px]">
        <div className="journal-note__head mb-2 flex items-center justify-between gap-3">
          <label htmlFor={`note-${entry.progressId}`} className="journal-note__label text-xs uppercase tracking-[0.22em]">
            Note
          </label>

          <button
            type="button"
            onClick={handleNoteAction}
            disabled={isSaving}
            className="journal-note__action flex h-7 w-7 items-center justify-center text-base disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isEditingNote ? "Salva nota" : "Modifica nota"}
            title={isEditingNote ? "Salva nota" : "Modifica nota"}
          >
            {isSaving ? "…" : isEditingNote ? "✓" : "✎"}
          </button>
        </div>

        <textarea
          ref={noteInputRef}
          id={`note-${entry.progressId}`}
          rows="3"
          value={noteValue}
          onChange={(event) => onNoteChange(entry.progressId, event.target.value)}
          placeholder={isEditingNote ? "Scrivi qui..." : ""}
          readOnly={!isEditingNote}
          className={
            isEditingNote
              ? "journal-note__textarea w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none"
              : "journal-note__textarea journal-note__textarea--readonly w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none cursor-default"
          }
        />
      </div>
    </article>
  )
}

export default JournalEntryCard
