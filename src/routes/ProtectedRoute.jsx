import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation()

  const accessToken = useSelector((state) => state.auth.accessToken)
  const currentUser = useSelector((state) => state.auth.currentUser)

  const isCheckingAuth = Boolean(accessToken && !currentUser)
  const isAuthenticated = Boolean(accessToken && currentUser)
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN"

  if (isCheckingAuth) {
    return <p className="text-muted">Caricamento...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/explore" replace />
  }

  return children
}

export default ProtectedRoute
