import { apiRequest } from "./apiClient"

export function getPublishedCities({ page = 0, size = 50, sortBy = "name" } = {}) {
  return apiRequest(`/cities?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function getPublishedCityById(cityId) {
  return apiRequest(`/cities/${cityId}`)
}

export function getPublishedPointsByCity(cityId, { page = 0, size = 50, sortBy = "name" } = {}) {
  return apiRequest(`/cities/${cityId}/points?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function getPublishedPointById(pointId) {
  return apiRequest(`/points/${pointId}`)
}

export function getPublishedExperiencesByPoint(pointId, { page = 0, size = 10, sortBy = "title" } = {}) {
  return apiRequest(`/points/${pointId}/experiences?page=${page}&size=${size}&sortBy=${sortBy}`)
}
