function PointPreviewCard({ point, isSelected = false, onSelect }) {
  return (
    <article
      className={
        isSelected
          ? "min-h-[420px] rounded-2xl border border-accent bg-surface p-4 shadow-xl shadow-accent/10 transition"
          : "min-h-[420px] rounded-2xl border border-border-soft bg-surface p-4 transition hover:border-accent-soft"
      }
    >
      <button type="button" onClick={onSelect} className="flex h-full w-full flex-col text-left">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-border-soft bg-canvas">
          {point.imageUrl ? (
            <img src={point.imageUrl} alt={point.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-soft/60 text-xs uppercase tracking-[0.25em] text-muted">Image</div>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">{point.cityName}</p>

          <h3 className="mt-3 font-serif text-2xl text-ink">{point.name}</h3>

          <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">{point.shortDescription}</p>

          <div className="mt-auto pt-5">
            <p className="text-xs text-muted">
              {point.latitude}, {point.longitude}
            </p>

            <p className="mt-3 text-sm text-accent">{isSelected ? "Selected point" : "Reveal point"}</p>
          </div>
        </div>
      </button>
    </article>
  )
}

export default PointPreviewCard
