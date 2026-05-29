import { apiRequest, authenticatedRequest } from "./apiClient"

export function getPublishedCities({ page = 0, size = 50, sortBy = "name" } = {}) {
  return apiRequest(`/cities?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function getPublishedCityById(cityId) {
  return authenticatedRequest(`/cities/${cityId}`)
}

export function getPublishedPointsByCity(cityId, { page = 0, size = 50, sortBy = "name" } = {}) {
  return authenticatedRequest(`/cities/${cityId}/points?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function getPublishedPointById(pointId) {
  return authenticatedRequest(`/points/${pointId}`)
}

export function getPublishedExperiencesByPoint(pointId, { page = 0, size = 10, sortBy = "title" } = {}) {
  return authenticatedRequest(`/points/${pointId}/experiences?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function getPublishedExperienceById(experienceId) {
  return authenticatedRequest(`/experiences/${experienceId}`)
}

export function getPublishedQuizGameByExperience(experienceId) {
  return authenticatedRequest(`/experiences/${experienceId}/quiz-game`)
}

export function getPublishedUploadGameByExperience(experienceId) {
  return authenticatedRequest(`/experiences/${experienceId}/upload-game`)
}
