import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/authSlice"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state.auth.currentUser)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN"

  function handleLogout() {
    dispatch(logout())
    setIsProfileMenuOpen(false)
    navigate("/")
  }

  function closeProfileMenu() {
    setIsProfileMenuOpen(false)
  }

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
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((currentValue) => !currentValue)}
              className="app-navbar__avatar"
              aria-label="Apri menu profilo"
              aria-expanded={isProfileMenuOpen}
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.username} className="h-full w-full object-cover" />
              ) : (
                <span>{currentUser.username?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </button>
          ) : (
            <Link to="/login" className="app-navbar__avatar app-navbar__avatar--empty" aria-label="Vai al login" title="Accedi" />
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

        {currentUser && isProfileMenuOpen && (
          <div className="app-navbar__profile-menu">
            <Link to="/profile" onClick={closeProfileMenu} className="app-navbar__profile-link">
              Profilo
            </Link>

            <button type="button" className="app-navbar__profile-link app-navbar__profile-link--muted" disabled>
              Preferenze
            </button>

            <button type="button" onClick={handleLogout} className="app-navbar__profile-link app-navbar__profile-link--logout">
              Esci
            </button>
          </div>
        )}
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
