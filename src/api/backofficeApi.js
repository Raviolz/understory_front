import { authenticatedRequest } from "./apiClient"

export function getBackofficeCities() {
  return authenticatedRequest("/backoffice/cities")
}

export function createBackofficeCity(cityData) {
  return authenticatedRequest("/backoffice/cities", {
    method: "POST",
    body: JSON.stringify(cityData),
  })
}

export function getBackofficePoints() {
  return authenticatedRequest("/backoffice/points")
}

export function getBackofficeExperiences() {
  return authenticatedRequest("/backoffice/experiences")
}

export function getBackofficeExperienceCategories() {
  return authenticatedRequest("/backoffice/experience-categories")
}

export function getBackofficeQuizGames() {
  return authenticatedRequest("/backoffice/quiz-games")
}

export function getBackofficeUploadGames() {
  return authenticatedRequest("/backoffice/upload-games")
}

export function getBackofficeBusinessCategories() {
  return authenticatedRequest("/backoffice/business-categories")
}

export function getBackofficeLocalBusinesses() {
  return authenticatedRequest("/backoffice/local-businesses")
}

export function getBackofficeRewards() {
  return authenticatedRequest("/backoffice/rewards")
}

export function getBackofficeUploadSubmissions() {
  return authenticatedRequest("/backoffice/upload-submissions")
}

export function getBackofficeUsers() {
  return authenticatedRequest("/backoffice/users")
}
