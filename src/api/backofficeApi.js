import { authenticatedRequest } from "./apiClient"

function buildPageQuery({ page = 0, size = 100, sortBy } = {}) {
  const params = new URLSearchParams()

  params.set("page", page)
  params.set("size", size)

  if (sortBy) {
    params.set("sortBy", sortBy)
  }

  return params.toString()
}

// CITIES

export function getBackofficeCities({ page = 0, size = 100, sortBy = "name" } = {}) {
  return authenticatedRequest(`/backoffice/cities?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeCity(cityId) {
  return authenticatedRequest(`/backoffice/cities/${cityId}`, {
    method: "DELETE",
  })
}

export function uploadBackofficeCityCoverImage(cityId, file) {
  const formData = new FormData()
  formData.append("file", file)

  return authenticatedRequest(`/backoffice/cities/${cityId}/cover-image`, {
    method: "PATCH",
    body: formData,
  })
}

// POINTS

export function getBackofficePoints({ page = 0, size = 100, sortBy = "name" } = {}) {
  return authenticatedRequest(`/backoffice/points?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficePoint(pointId) {
  return authenticatedRequest(`/backoffice/points/${pointId}`, {
    method: "DELETE",
  })
}

export function uploadBackofficePointImage(pointId, file) {
  const formData = new FormData()
  formData.append("file", file)

  return authenticatedRequest(`/backoffice/points/${pointId}/image`, {
    method: "PATCH",
    body: formData,
  })
}

// EXPERIENCES

export function getBackofficeExperiences({ page = 0, size = 100, sortBy = "title" } = {}) {
  return authenticatedRequest(`/backoffice/experiences?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeExperience(experienceId) {
  return authenticatedRequest(`/backoffice/experiences/${experienceId}`, {
    method: "DELETE",
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

export function uploadBackofficeExperienceRevealImage(experienceId, file) {
  const formData = new FormData()
  formData.append("file", file)

  return authenticatedRequest(`/backoffice/experiences/${experienceId}/reveal-image`, {
    method: "PATCH",
    body: formData,
  })
}

// EXPERIENCE CATEGORIES

export function getBackofficeExperienceCategories({ page = 0, size = 100, sortBy = "label" } = {}) {
  return authenticatedRequest(`/backoffice/experience-categories?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeExperienceCategory(categoryId) {
  return authenticatedRequest(`/backoffice/experience-categories/${categoryId}`, {
    method: "DELETE",
  })
}

// QUIZ GAMES

export function getBackofficeQuizGames({ page = 0, size = 100, sortBy = "experienceTitle" } = {}) {
  return authenticatedRequest(`/backoffice/quiz-games?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeQuizGame(quizGameId) {
  return authenticatedRequest(`/backoffice/quiz-games/${quizGameId}`, {
    method: "DELETE",
  })
}

// UPLOAD GAMES

export function getBackofficeUploadGames({ page = 0, size = 100, sortBy = "experienceTitle" } = {}) {
  return authenticatedRequest(`/backoffice/upload-games?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeUploadGame(uploadGameId) {
  return authenticatedRequest(`/backoffice/upload-games/${uploadGameId}`, {
    method: "DELETE",
  })
}

export function uploadBackofficeUploadGameReferenceImage(uploadGameId, file) {
  const formData = new FormData()
  formData.append("file", file)

  return authenticatedRequest(`/backoffice/upload-games/${uploadGameId}/reference-image`, {
    method: "PATCH",
    body: formData,
  })
}

// BUSINESS CATEGORIES

export function getBackofficeBusinessCategories({ page = 0, size = 100, sortBy = "label" } = {}) {
  return authenticatedRequest(`/backoffice/business-categories?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeBusinessCategory(categoryId) {
  return authenticatedRequest(`/backoffice/business-categories/${categoryId}`, {
    method: "DELETE",
  })
}

// LOCAL BUSINESSES

export function getBackofficeLocalBusinesses({ page = 0, size = 100, sortBy = "name" } = {}) {
  return authenticatedRequest(`/backoffice/local-businesses?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeLocalBusiness(businessId) {
  return authenticatedRequest(`/backoffice/local-businesses/${businessId}`, {
    method: "DELETE",
  })
}

export function uploadBackofficeLocalBusinessImage(businessId, file) {
  const formData = new FormData()
  formData.append("file", file)

  return authenticatedRequest(`/backoffice/local-businesses/${businessId}/image`, {
    method: "PATCH",
    body: formData,
  })
}

// REWARDS

export function getBackofficeRewards({ page = 0, size = 100, sortBy = "title" } = {}) {
  return authenticatedRequest(`/backoffice/rewards?${buildPageQuery({ page, size, sortBy })}`)
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

export function deleteBackofficeReward(rewardId) {
  return authenticatedRequest(`/backoffice/rewards/${rewardId}`, {
    method: "DELETE",
  })
}

// UPLOAD SUBMISSIONS

export function getBackofficeUploadSubmissions({ page = 0, size = 100, sortBy = "submittedAt" } = {}) {
  return authenticatedRequest(`/backoffice/upload-submissions?${buildPageQuery({ page, size, sortBy })}`)
}

export function approveBackofficeUploadSubmission(submissionId) {
  return authenticatedRequest(`/backoffice/upload-submissions/${submissionId}/approve`, {
    method: "PATCH",
  })
}

export function rejectBackofficeUploadSubmission(submissionId) {
  return authenticatedRequest(`/backoffice/upload-submissions/${submissionId}/reject`, {
    method: "PATCH",
  })
}

export function getBackofficeUploadSubmissionsByStatus(status, { page = 0, size = 100, sortBy = "submittedAt" } = {}) {
  return authenticatedRequest(`/backoffice/upload-submissions/status/${status}?${buildPageQuery({ page, size, sortBy })}`)
}

// USERS

export function getBackofficeUsers({ page = 0, size = 100, sortBy = "username" } = {}) {
  return authenticatedRequest(`/backoffice/users?${buildPageQuery({ page, size, sortBy })}`)
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

// BOOKING

export function getBookings({ page = 0, size = 50, sortBy = "bookingDate" } = {}) {
  return authenticatedRequest(`/backoffice/bookings?${buildPageQuery({ page, size, sortBy })}`)
}

export function getBookingsByStatus(status, { page = 0, size = 50, sortBy = "bookingDate" } = {}) {
  return authenticatedRequest(`/backoffice/bookings/status/${status}?${buildPageQuery({ page, size, sortBy })}`)
}

export function confirmBooking(bookingId) {
  return authenticatedRequest(`/backoffice/bookings/${bookingId}/confirm`, {
    method: "PATCH",
  })
}

export function rejectBooking(bookingId) {
  return authenticatedRequest(`/backoffice/bookings/${bookingId}/reject`, {
    method: "PATCH",
  })
}
