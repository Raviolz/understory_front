import "./App.css"

import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"

import { getMyProfile } from "./api/authApi"
import { logout, setCurrentUser } from "./redux/authSlice"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import MobileBottomNav from "./components/layout/MobileBottomNav"

import LandingPage from "./pages/LandingPage"
import JournalPage from "./pages/JournalPage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import BackofficeRoutes from "./routes/BackofficeRoutes"
import CityDetailPage from "./pages/CityDetailPage"
import ExperienceDetailPage from "./pages/ExperienceDetailsPage"
import FindingsPage from "./pages/FindingsPage"
import ProtectedRoute from "./routes/ProtectedRoute"

function AppShell() {
  const location = useLocation()

  const isLanding = location.pathname === "/" || location.pathname === "/explore"
  const isPanelPage =
    location.pathname === "/journal" ||
    location.pathname === "/findings" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/profile" ||
    location.pathname.startsWith("/cities/")
  return (
    <div className={isLanding ? "flex h-dvh flex-col overflow-hidden bg-canvas text-ink" : "min-h-screen bg-canvas text-ink"}>
      <Navbar />

      <main
        className={
          isLanding
            ? "relative mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-hidden"
            : isPanelPage
              ? "min-h-screen w-full"
              : "mx-auto min-h-screen w-full max-w-7xl px-5 py-10 pb-28 md:px-8 md:py-14"
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/backoffice/*"
            element={
              <ProtectedRoute requireAdmin>
                <BackofficeRoutes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <JournalPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/findings"
            element={
              <ProtectedRoute>
                <FindingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cities/:cityId"
            element={
              <ProtectedRoute>
                <CityDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/experiences/:experienceId"
            element={
              <ProtectedRoute>
                <ExperienceDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      return
    }

    getMyProfile()
      .then((profile) => {
        dispatch(setCurrentUser(profile))
      })
      .catch((error) => {
        console.error(error)
        dispatch(logout())
      })
  }, [dispatch])

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
