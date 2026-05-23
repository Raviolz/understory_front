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

export function publishBackofficeCity(cityId) {
  return authenticatedRequest(`/backoffice/cities/${cityId}/publish`, {
    method: "PATCH",
  })
}

export function unpublishBackofficeCity(cityId) {
  return authenticatedRequest(`/backoffice/cities/${cityId}/unpublish`, {
    method: "PATCH",
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

export function getBackofficePointById(pointId) {
  return authenticatedRequest(`/backoffice/points/${pointId}`)
}

export function updateBackofficePoint(pointId, pointData) {
  return authenticatedRequest(`/backoffice/points/${pointId}`, {
    method: "PUT",
    body: JSON.stringify(pointData),
  })
}

export function publishBackofficePoint(pointId) {
  return authenticatedRequest(`/backoffice/points/${pointId}/publish`, {
    method: "PATCH",
  })
}

export function unpublishBackofficePoint(pointId) {
  return authenticatedRequest(`/backoffice/points/${pointId}/unpublish`, {
    method: "PATCH",
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

export function publishBackofficeExperience(experienceId) {
  return authenticatedRequest(`/backoffice/experiences/${experienceId}/publish`, {
    method: "PATCH",
  })
}

export function unpublishBackofficeExperience(experienceId) {
  return authenticatedRequest(`/backoffice/experiences/${experienceId}/unpublish`, {
    method: "PATCH",
  })
}

export function getBackofficeExperienceById(experienceId) {
  return authenticatedRequest(`/backoffice/experiences/${experienceId}`)
}

export function updateBackofficeExperience(experienceId, experienceData) {
  return authenticatedRequest(`/backoffice/experiences/${experienceId}`, {
    method: "PUT",
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

export function getBackofficeExperienceCategoryById(categoryId) {
  return authenticatedRequest(`/backoffice/experience-categories/${categoryId}`)
}

export function updateBackofficeExperienceCategory(categoryId, categoryData) {
  return authenticatedRequest(`/backoffice/experience-categories/${categoryId}`, {
    method: "PUT",
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

export function getBackofficeQuizGameById(quizGameId) {
  return authenticatedRequest(`/backoffice/quiz-games/${quizGameId}`)
}

export function updateBackofficeQuizGame(quizGameId, quizData) {
  return authenticatedRequest(`/backoffice/quiz-games/${quizGameId}`, {
    method: "PUT",
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

export function getBackofficeUploadGameById(uploadGameId) {
  return authenticatedRequest(`/backoffice/upload-games/${uploadGameId}`)
}

export function updateBackofficeUploadGame(uploadGameId, uploadData) {
  return authenticatedRequest(`/backoffice/upload-games/${uploadGameId}`, {
    method: "PUT",
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

export function getBackofficeBusinessCategoryById(categoryId) {
  return authenticatedRequest(`/backoffice/business-categories/${categoryId}`)
}

export function updateBackofficeBusinessCategory(categoryId, categoryData) {
  return authenticatedRequest(`/backoffice/business-categories/${categoryId}`, {
    method: "PUT",
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

export function getBackofficeLocalBusinessById(businessId) {
  return authenticatedRequest(`/backoffice/local-businesses/${businessId}`)
}

export function updateBackofficeLocalBusiness(businessId, businessData) {
  return authenticatedRequest(`/backoffice/local-businesses/${businessId}`, {
    method: "PUT",
    body: JSON.stringify(businessData),
  })
}

export function publishBackofficeLocalBusiness(businessId) {
  return authenticatedRequest(`/backoffice/local-businesses/${businessId}/publish`, {
    method: "PATCH",
  })
}

export function unpublishBackofficeLocalBusiness(businessId) {
  return authenticatedRequest(`/backoffice/local-businesses/${businessId}/unpublish`, {
    method: "PATCH",
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

export function getBackofficeRewardById(rewardId) {
  return authenticatedRequest(`/backoffice/rewards/${rewardId}`)
}

export function updateBackofficeReward(rewardId, rewardData) {
  return authenticatedRequest(`/backoffice/rewards/${rewardId}`, {
    method: "PUT",
    body: JSON.stringify(rewardData),
  })
}

export function publishBackofficeReward(rewardId) {
  return authenticatedRequest(`/backoffice/rewards/${rewardId}/publish`, {
    method: "PATCH",
  })
}

export function unpublishBackofficeReward(rewardId) {
  return authenticatedRequest(`/backoffice/rewards/${rewardId}/unpublish`, {
    method: "PATCH",
  })
}
// UPLOAD SUBMISSIONS
export function getBackofficeUploadSubmissions() {
  return authenticatedRequest("/backoffice/upload-submissions")
}

// USERS
export function getBackofficeUsers() {
  return authenticatedRequest("/backoffice/users")
}

export function promoteBackofficeUser(userId) {
  return authenticatedRequest(`/backoffice/users/${userId}/admin`, {
    method: "PATCH",
  })
}

export function downgradeBackofficeUser(userId) {
  return authenticatedRequest(`/backoffice/users/${userId}/user`, {
    method: "PATCH",
  })
}
