import { Link, NavLink } from "react-router-dom"

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-canvas backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <nav className="hidden items-center gap-8 md:flex">
          <NavItem to="/explore">Explore</NavItem>
          <NavItem to="/journal">Journal</NavItem>
        </nav>

        <Link to="/" className="font-serif text-xl  tracking-[0.35em] text-accent md:absolute md:left-1/2 md:-translate-x-1/2 md:text-2xl">
          UNDERSTORY
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden text-right text-xs  tracking-[0.18em] md:block">
            <p className="text-arcane">Insights 75</p>
            <p className="text-muted">Circle I</p>
          </div>

          <Link
            to="/profile"
            className="block h-10 w-10 rounded-full border border-accent-soft bg-surface-soft transition hover:border-accent"
            aria-label="Open profile"
          />
        </div>
      </div>
    </header>
  )
}

// Wrapper per i link di navigazione.
// NavLink permette di sapere se la rotta è attiva e assegnarli classi --> Link : vai a quella pagina, NavLink vai a quella pagina e riconosci dove sei

function NavItem({ to, children }) {
  // children e' una props speciale di React --> e' quello che scrivo dentro al componente
  return (
    <NavLink to={to} className={({ isActive }) => ["text-xs tracking-[0.22em] transition", isActive ? "text-accent" : "text-muted hover:text-ink"].join(" ")}>
      {children}
    </NavLink>
  )
}

// PER EVITARE TOT VOLTE RIPETIZIONE DI :
{
  /* <NavLink
  to="/journal"
  className={({ isActive }) =>
    isActive
      ? "text-xs tracking-[0.22em] text-accent transition"
      : "text-xs tracking-[0.22em] text-muted transition hover:text-accent"
  }
>
  Journal
</NavLink> */
}

export default Navbar
