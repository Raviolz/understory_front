import { useEffect, useRef, useState } from "react"

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
    <article className="relative min-h-[265px] min-w-0 overflow-visible rounded-[1rem] border border-border-soft bg-surface px-4 py-3 shadow-sm">
      <header className="grid grid-cols-[1fr_auto] items-start gap-4 border-b border-border-soft pb-2">
        <div className="min-w-0">
          <h2 className="truncate font-serif text-lg leading-tight text-ink">{entry.experienceTitle}</h2>

          <p className="mt-1 truncate text-sm text-muted">{entry.pointOfInterestName}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">{entry.cityName}</p>

          <p className="mt-1 text-xs text-muted">{completedDate}</p>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-[120px_1fr] items-start gap-4 min-[430px]:grid-cols-[150px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-canvas">
          {entry.revealImageUrl ? (
            <img src={entry.revealImageUrl} alt={entry.revealTitle} className="h-28 w-full object-cover" />
          ) : (
            <div className="flex h-28 w-full items-center justify-center px-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted">No image</div>
          )}
        </div>

        <div className="min-w-0">
          <p className="line-clamp-2 font-serif text-sm leading-6 text-ink">{entry.revealTitle}</p>

          <p className="mt-3 line-clamp-4 text-sm leading-4 text-muted">{entry.journalText || entry.revealText}</p>
        </div>
      </div>

      <div className="absolute -bottom-24 right-6 z-10 w-[230px] rotate-1 rounded-xl border border-[#8f7537] bg-[#cdb06a] p-4 text-[#21170e] shadow-lg max-[430px]:right-3 max-[430px]:w-[200px]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor={`note-${entry.progressId}`} className="text-xs uppercase tracking-[0.22em]">
            Notes
          </label>

          <button
            type="button"
            onClick={handleNoteAction}
            disabled={isSaving}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8f7537] text-sm transition hover:bg-[#21170e] hover:text-[#cdb06a] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isEditingNote ? "Save note" : "Edit note"}
            title={isEditingNote ? "Save note" : "Edit note"}
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
          placeholder={isEditingNote ? "Scrivi qui..." : "Nessuna nota"}
          readOnly={!isEditingNote}
          className={
            isEditingNote
              ? "w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none placeholder:text-[#6f5527]"
              : "w-full resize-none border-0 bg-transparent text-sm leading-6 outline-none placeholder:text-[#6f5527] cursor-default"
          }
        />
      </div>
    </article>
  )
}

export default JournalEntryCard
