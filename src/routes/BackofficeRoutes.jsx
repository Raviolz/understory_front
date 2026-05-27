import { Navigate, Route, Routes } from "react-router-dom"

import BackofficePage from "../pages/backoffice/BackofficePage"
import BoCitiesPage from "../pages/backoffice/cities/BoCitiesPage"
import BoCityCreatePage from "../pages/backoffice/cities/BoCityCreatePage"
import BoPointsPage from "../pages/backoffice/points/BoPointsPage"
import BoExperienceCategoriesPage from "../pages/backoffice/experience_categories/BoExperienceCategoriesPage"
import BoExperiencesPage from "../pages/backoffice/experiences/BoExperiencesPage"
import BoGamesPage from "../pages/backoffice/games/BoGamesPage"
import BoUploadSubmissionsPage from "../pages/backoffice/upload_submissions/BoUploadSubmissionsPage"
import BoBusinessCategoriesPage from "../pages/backoffice/business_categories/BoBusinessCategoriesPage"
import BoLocalBusinessesPage from "../pages/backoffice/local_businesses/BoLocalBusinessesPage"
import BoRewardsPage from "../pages/backoffice/rewards/BoRewardsPage"
import BoUsersPage from "../pages/backoffice/users/BoUserPage"
import BoExperienceCategoryCreatePage from "../pages/backoffice/experience_categories/BoExperienceCategoryCreatePage"
import BoBusinessCategoryCreatePage from "../pages/backoffice/business_categories/BoBusinessCategoryCreatePage"
import BoPointCreatePage from "../pages/backoffice/points/BoPointCreatePage"
import BoLocalBusinessCreatePage from "../pages/backoffice/local_businesses/BoLocalBusinessesCreatePage"
import BoExperienceCreatePage from "../pages/backoffice/experiences/BoExperienceCreatePage"
import BoQuizGameCreatePage from "../pages/backoffice/games/BoQuizGameCreatePage"
import BoUploadGameCreatePage from "../pages/backoffice/games/BoUploadGameCreatePage"
import BoRewardCreatePage from "../pages/backoffice/rewards/BoRewardCreatePage"
import BoCityEditPage from "../pages/backoffice/cities/BoCityEditPage"
import BoExperienceCategoryEditPage from "../pages/backoffice/experience_categories/BoExperienceCategoryEditPage"
import BoBusinessCategoryEditPage from "../pages/backoffice/business_categories/BoBusinessCategoryEditPage"
import BoPointEditPage from "../pages/backoffice/points/BoPointEditPage"
import BoLocalBusinessEditPage from "../pages/backoffice/local_businesses/BoLocalBusinessEditPage"
import BoExperienceEditPage from "../pages/backoffice/experiences/BoExperienceEditPage"
import BoQuizGameEditPage from "../pages/backoffice/games/BoQuizGameEditPage"
import BoUploadGameEditPage from "../pages/backoffice/games/BoUploadGameEdit"
import BoRewardEditPage from "../pages/backoffice/rewards/BoRewardEditPage"
import BoBookingsPage from "../pages/backoffice/bookings/BoBookingsPage"

function BackofficeRoutes() {
  return (
    <Routes>
      <Route index element={<BackofficePage />} />
      {/*                                                                   CITIES                                             */}
      <Route path="cities" element={<BoCitiesPage />} />
      <Route path="cities/new" element={<BoCityCreatePage />} />
      <Route path="cities/:cityId/edit" element={<BoCityEditPage />} />
      {/*                                                                   POINTS                                           */}
      <Route path="points" element={<BoPointsPage />} />
      <Route path="points/new" element={<BoPointCreatePage />} />
      <Route path="points/:pointId/edit" element={<BoPointEditPage />} />
      {/*                                                                  EXPERIENCE CATEGORIES --> SUPERADMIN                                           */}
      <Route path="experience-categories" element={<BoExperienceCategoriesPage />} />
      <Route path="experience-categories/new" element={<BoExperienceCategoryCreatePage />} />
      <Route path="experience-categories/:categoryId/edit" element={<BoExperienceCategoryEditPage />} />
      {/*                                                               EXPERIENCES                                             */}
      <Route path="experiences" element={<BoExperiencesPage />} />
      <Route path="experiences/new" element={<BoExperienceCreatePage />} />
      <Route path="experiences/:experienceId/edit" element={<BoExperienceEditPage />} />
      {/*                                                                   GAMES                                          */}
      <Route path="games" element={<BoGamesPage />} />
      <Route path="quiz-games/new" element={<BoQuizGameCreatePage />} />
      <Route path="quiz-games/:quizGameId/edit" element={<BoQuizGameEditPage />} />
      <Route path="upload-games/new" element={<BoUploadGameCreatePage />} />
      <Route path="upload-games/:uploadGameId/edit" element={<BoUploadGameEditPage />} />

      {/*                                                                   GAME SUBMISSIONS                                           */}
      <Route path="upload-submissions" element={<BoUploadSubmissionsPage />} />
      {/*                                                                  BUSINESS CATEGORIES --> SUPERADMIN                                           */}

      <Route path="business-categories" element={<BoBusinessCategoriesPage />} />
      <Route path="business-categories/:categoryId/edit" element={<BoBusinessCategoryEditPage />} />
      <Route path="business-categories/new" element={<BoBusinessCategoryCreatePage />} />
      {/*                                                                   LOCAL BUSINESSES                                             */}
      <Route path="local-businesses" element={<BoLocalBusinessesPage />} />
      <Route path="local-businesses/new" element={<BoLocalBusinessCreatePage />} />
      <Route path="local-businesses/:businessId/edit" element={<BoLocalBusinessEditPage />} />
      {/*                                                                       REWARDS                                         */}
      <Route path="rewards" element={<BoRewardsPage />} />
      <Route path="rewards/new" element={<BoRewardCreatePage />} />
      <Route path="rewards/:rewardId/edit" element={<BoRewardEditPage />} />

      {/*                                                                   BOOKINGS                                           */}
      <Route path="bookings" element={<BoBookingsPage />} />
      {/*                                                                   USERS                                            */}
      <Route path="users" element={<BoUsersPage />} />

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default BackofficeRoutes
