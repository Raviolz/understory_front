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

  function toRomanNumber(number) {
    const romanNumbers = [
      { value: 1000, symbol: "M" },
      { value: 900, symbol: "CM" },
      { value: 500, symbol: "D" },
      { value: 400, symbol: "CD" },
      { value: 100, symbol: "C" },
      { value: 90, symbol: "XC" },
      { value: 50, symbol: "L" },
      { value: 40, symbol: "XL" },
      { value: 10, symbol: "X" },
      { value: 9, symbol: "IX" },
      { value: 5, symbol: "V" },
      { value: 4, symbol: "IV" },
      { value: 1, symbol: "I" },
    ]

    let result = ""
    let remainingNumber = Number(number) || 1

    romanNumbers.forEach((romanNumber) => {
      while (remainingNumber >= romanNumber.value) {
        result += romanNumber.symbol
        remainingNumber -= romanNumber.value
      }
    })

    return result
  }

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <nav className="hidden items-center gap-7 md:flex">
          <NavItem to="/explore">Esplora</NavItem>
          <NavItem to="/journal">Archivio</NavItem>
          <NavItem to="/findings">Accessi</NavItem>

          {isAdmin && (
            <NavLink
              to="/backoffice"
              className={({ isActive }) => (isActive ? "app-nav-link app-nav-link--active app-nav-link--backoffice" : "app-nav-link app-nav-link--backoffice")}
              onClick={closeProfileMenu}
            >
              Backoffice
            </NavLink>
          )}
        </nav>

        <Link to="/" className="app-navbar__brand">
          UNDERSTORY
        </Link>

        <div className="flex items-center gap-3">
          {currentUser && (
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
          )}

          {currentUser && (
            <div className="app-navbar__stats hidden md:grid">
              <p className="app-navbar__meta">
                <span>CERCHIA</span>
                <span>{toRomanNumber(currentUser.level)}</span>
              </p>

              <p className="app-navbar__meta">
                <span>INTUIZIONI</span>
                <span>{currentUser.xp}</span>
              </p>
            </div>
          )}

          {!currentUser && (
            <Link to="/login" className="app-nav-link">
              Accedi
            </Link>
          )}

          {isAdmin && (
            <NavLink
              to="/backoffice"
              className={({ isActive }) =>
                isActive ? "app-nav-link app-nav-link--active app-nav-link--backoffice md:hidden" : "app-nav-link app-nav-link--backoffice md:hidden"
              }
              onClick={closeProfileMenu}
            >
              Admin
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
