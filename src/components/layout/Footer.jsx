import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <Link to="/contacts" className="app-footer__contact-link" aria-label="Contatti">
          Contatti
        </Link>
        <p className="app-footer__brand">UNDERSTORY ARCHIVES</p>
        <p className="app-footer__copy"> Atlante di storie al margine</p>
        <p className="app-footer__legal">© Understory</p>

        <Link to="#" className="app-footer__dedication">
          ✦
        </Link>
      </div>
    </footer>
  )
}

export default Footer
