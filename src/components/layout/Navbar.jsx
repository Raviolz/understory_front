import { Link, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"

function Navbar() {
  const currentUser = useSelector((state) => state.auth.currentUser)

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN"

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <nav className="hidden items-center gap-7 md:flex">
          <NavItem to="/explore">Esplora</NavItem>
          <NavItem to="/journal">Archivio</NavItem>
          <NavItem to="/findings">Accessi</NavItem>
        </nav>

        <Link to="/" className="app-navbar__brand">
          UNDERSTORY
        </Link>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden text-right md:block">
              <p className="app-navbar__meta text-accent">Intuizioni {currentUser.xp}</p>
              <p className="app-navbar__meta">Cerchia {currentUser.level}</p>
            </div>
          )}

          {currentUser ? (
            <Link to="/profile" className="app-navbar__avatar" aria-label="Apri profilo">
              {currentUser.avatarUrl && <img src={currentUser.avatarUrl} alt={currentUser.username} className="h-full w-full object-cover" />}
            </Link>
          ) : (
            <div className="app-navbar__avatar app-navbar__avatar--empty" />
          )}
          {isAdmin && (
            <NavLink
              to="/backoffice"
              className={({ isActive }) => (isActive ? "app-nav-link app-nav-link--active hidden md:block" : "app-nav-link hidden md:block")}
            >
              Backoffice
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "app-nav-link app-nav-link--active" : "app-nav-link")}>
      {children}
    </NavLink>
  )
}

export default Navbar
