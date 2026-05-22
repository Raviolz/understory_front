import { authenticatedRequest } from "./apiClient"

// CITIES

export function getBackofficeCities() {
  return authenticatedRequest("/backoffice/cities")
}

export function getBackofficeCityById(cityId) {
  return authenticatedRequest(`/backoffice/cities/${cityId}`)
}

export function createBackofficeCity(cityData) {
  return authenticatedRequest("/backoffice/cities", {
    method: "POST",
    body: JSON.stringify(cityData),
  })
}

export function updateBackofficeCity(cityId, cityData) {
  return authenticatedRequest(`/backoffice/cities/${cityId}`, {
    method: "PUT",
    body: JSON.stringify(cityData),
  })
}

// POINTS

export function getBackofficePoints() {
  return authenticatedRequest("/backoffice/points")
}

export function createBackofficePoint(pointData) {
  return authenticatedRequest("/backoffice/points", {
    method: "POST",
    body: JSON.stringify(pointData),
  })
}

// EXPERIENCES

export function getBackofficeExperiences() {
  return authenticatedRequest("/backoffice/experiences")
}

export function createBackofficeExperience(experienceData) {
  return authenticatedRequest("/backoffice/experiences", {
    method: "POST",
    body: JSON.stringify(experienceData),
  })
}

// EXPERIENCE CATEGORIES

export function getBackofficeExperienceCategories() {
  return authenticatedRequest("/backoffice/experience-categories")
}

export function createBackofficeExperienceCategory(categoryData) {
  return authenticatedRequest("/backoffice/experience-categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  })
}

// QUIZ GAMES

export function getBackofficeQuizGames() {
  return authenticatedRequest("/backoffice/quiz-games")
}

export function createBackofficeQuizGame(quizData) {
  return authenticatedRequest("/backoffice/quiz-games", {
    method: "POST",
    body: JSON.stringify(quizData),
  })
}

// UPLOAD GAMES

export function getBackofficeUploadGames() {
  return authenticatedRequest("/backoffice/upload-games")
}

export function createBackofficeUploadGame(uploadData) {
  return authenticatedRequest("/backoffice/upload-games", {
    method: "POST",
    body: JSON.stringify(uploadData),
  })
}

// BUSINESS CATEGORIES

export function getBackofficeBusinessCategories() {
  return authenticatedRequest("/backoffice/business-categories")
}

export function createBackofficeBusinessCategory(categoryData) {
  return authenticatedRequest("/backoffice/business-categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  })
}

// LOCAL BUSINESSES

export function getBackofficeLocalBusinesses() {
  return authenticatedRequest("/backoffice/local-businesses")
}

export function createBackofficeLocalBusiness(businessData) {
  return authenticatedRequest("/backoffice/local-businesses", {
    method: "POST",
    body: JSON.stringify(businessData),
  })
}

// REWARDS

export function getBackofficeRewards() {
  return authenticatedRequest("/backoffice/rewards")
}

export function createBackofficeReward(rewardData) {
  return authenticatedRequest("/backoffice/rewards", {
    method: "POST",
    body: JSON.stringify(rewardData),
  })
}

export function getBackofficeUploadSubmissions() {
  return authenticatedRequest("/backoffice/upload-submissions")
}

export function getBackofficeUsers() {
  return authenticatedRequest("/backoffice/users")
}
