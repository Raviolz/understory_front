import { useState } from "react"

function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isDedicationOpen, setIsDedicationOpen] = useState(false)

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__contact">
          <button
            type="button"
            className="app-footer__contact-link"
            aria-label="Apri contatti"
            aria-expanded={isContactOpen}
            onClick={() => {
              setIsContactOpen((value) => !value)
              setIsDedicationOpen(false)
            }}
          >
            Contatti
          </button>

          {isContactOpen && (
            <div className="app-footer__contact-card">
              <p className="app-footer__contact-kicker">Contatti</p>
              <p>understory@archives.local</p>
              <p>Risposte entro 48 ore.</p>
              <p>Per collaborazioni, errori o segnalazioni.</p>
            </div>
          )}
        </div>

        <p className="app-footer__brand">UNDERSTORY ARCHIVES</p>
        <p className="app-footer__copy"> Atlante di storie al margine</p>
        <p className="app-footer__legal">© Understory</p>

        <div className="app-footer__dedication-wrap">
          <button
            type="button"
            className="app-footer__dedication"
            aria-label="Apri dedica"
            aria-expanded={isDedicationOpen}
            onClick={() => {
              setIsDedicationOpen((value) => !value)
              setIsContactOpen(false)
            }}
          >
            ✦
          </button>

          {isDedicationOpen && (
            <div className="app-footer__dedication-card">
              <p>A mia mamma:</p>
              <p>Grazie.</p>
              <span className="app-footer__dedication-heart" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
