function BackofficePagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalPages <= 1) return null

  const currentPage = pageData.number ?? 0
  const totalPages = pageData.totalPages ?? 1
  const totalElements = pageData.totalElements ?? 0

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-border-soft pt-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
      <p>
        Page <span className="text-ink">{currentPage + 1}</span> of <span className="text-ink">{totalPages}</span>
        {totalElements ? <span> · {totalElements} elementi</span> : null}
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={pageData.first}
          className="rounded-full border border-border-soft px-4 py-2 text-muted transition hover:border-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Prev
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={pageData.last}
          className="rounded-full border border-border-soft px-4 py-2 text-muted transition hover:border-accent-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default BackofficePagination
