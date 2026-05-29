function AuthCard({ label, title, description, children }) {
  return (
    <div className="auth-card">
      {label && <p className="auth-card__label">{label}</p>}

      <h1 className="auth-card__title">{title}</h1>

      {description && <p className="auth-card__description">{description}</p>}

      <div className="auth-card__body">{children}</div>
    </div>
  )
}

export default AuthCard
