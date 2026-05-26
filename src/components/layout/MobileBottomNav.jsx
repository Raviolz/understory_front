import { NavLink } from "react-router-dom"

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-border-soft bg-surface px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <BottomNavItem to="/explore">Explore</BottomNavItem>
        <BottomNavItem to="/journal">Journal</BottomNavItem>
        <BottomNavItem to="/findings">Findings</BottomNavItem>
      </div>
    </nav>
  )
}

function BottomNavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "text-[11px] tracking-[0.18em] text-accent transition" : "text-[11px] tracking-[0.18em] text-muted transition hover:text-accent"
      }
    >
      {children}
    </NavLink>
  )
}

export default MobileBottomNav
