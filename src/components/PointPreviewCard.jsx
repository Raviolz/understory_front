function PointPreviewCard({ point, isSelected = false, onSelect }) {
  return (
    <article
      className={
        isSelected
          ? "flex min-h-[260px] flex-col rounded-2xl border border-accent bg-surface p-5 shadow-xl shadow-accent/10 transition"
          : "flex min-h-[260px] flex-col rounded-2xl border border-border-soft bg-surface p-5 transition hover:border-accent-soft"
      }
    >
      <button type="button" onClick={onSelect} className="flex h-full flex-col text-left">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{point.cityName}</p>

        <h3 className="mt-4 font-serif text-2xl text-ink">{point.name}</h3>

        <p className="mt-4 line-clamp-5 text-sm leading-6 text-muted">{point.shortDescription}</p>

        <div className="mt-auto pt-6">
          <p className="text-xs text-muted">
            {point.latitude}, {point.longitude}
          </p>

          <p className="mt-3 text-sm text-accent">{isSelected ? "Selected point" : "Reveal point"}</p>
        </div>
      </button>
    </article>
  )
}

export default PointPreviewCard
