import "./App.css"

import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useDispatch } from "react-redux"

import { getMyProfile } from "./api/authApi"
import { logout, setCurrentUser } from "./redux/authSlice"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import MobileBottomNav from "./components/layout/MobileBottomNav"

import LandingPage from "./pages/LandingPage"
import ExplorePage from "./pages/ExplorePage"
import JournalPage from "./pages/JournalPage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

import BoCitiesPage from "./pages/backoffice/cities/BoCitiesPage"
import BackofficePage from "./pages/backoffice/BackofficePage"
import BoPointsPage from "./pages/backoffice/points/BoPointsPage"
import BoExperiencesPage from "./pages/backoffice/experiences/BoExperiencesPage"
import BoExperienceCategoriesPage from "./pages/backoffice/experience_categories/BoExperienceCategoriesPage"
import BoGamesPage from "./pages/backoffice/games/BoGamesPage"
import BoBusinessCategoriesPage from "./pages/backoffice/business_categories/BoBusinessCategoriesPage"
import BoLocalBusinessesPage from "./pages/backoffice/local_businesses/BoLocalBusinessesPage"
import BoRewardsPage from "./pages/backoffice/rewards/BoRewardsPage"
import BoUploadSubmissionsPage from "./pages/backoffice/upload_submissions/BoUploadSubmissionsPage"
import BoUsersPage from "./pages/backoffice/users/BoUserPage"

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
      <div className="min-h-screen bg-canvas text-ink">
        <Navbar />

        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 pb-28 md:px-8 md:py-14">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/backoffice" element={<BackofficePage />} />
            <Route path="/backoffice/cities" element={<BoCitiesPage />} />
            <Route path="/backoffice/points" element={<BoPointsPage />} />
            <Route path="/backoffice/experience-categories" element={<BoExperienceCategoriesPage />} />
            <Route path="/backoffice/experiences" element={<BoExperiencesPage />} />
            <Route path="/backoffice/games" element={<BoGamesPage />} />
            <Route path="/backoffice/upload-submissions" element={<BoUploadSubmissionsPage />} />
            <Route path="/backoffice/business-categories" element={<BoBusinessCategoriesPage />} />
            <Route path="/backoffice/local-businesses" element={<BoLocalBusinessesPage />} />
            <Route path="/backoffice/rewards" element={<BoRewardsPage />} />
            <Route path="/backoffice/users" element={<BoUsersPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>

        <Footer />
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
