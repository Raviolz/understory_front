function AuthCard({ label, title, description, children }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-3xl border border-border-soft bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        {label && <p className="text-sm tracking-[0.25em] text-accent">{label}</p>}

        <h1 className="mt-4 font-serif text-4xl text-ink">{title}</h1>

        {description && <p className="mt-4 text-sm leading-6 text-muted">{description}</p>}

        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export default AuthCard
