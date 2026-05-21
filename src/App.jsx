import "./App.css"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import LandingPage from "./pages/LandingPage"
import ExplorePage from "./pages/ExplorePage"
import JournalPage from "./pages/JournalPage"
import ProfilePage from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"
import Footer from "./components/layout/Footer"
import MobileBottomNav from "./components/layout/MobileBottomNav"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-canvas text-ink">
        <Navbar />
        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-10 pb-28 md:px-8 md:py-14">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <MobileBottomNav />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
