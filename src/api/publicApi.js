import { apiRequest } from "./apiClient"

export function getPublishedCities({ page = 0, size = 50, sortBy = "name" } = {}) {
  return apiRequest(`/cities?page=${page}&size=${size}&sortBy=${sortBy}`)
}
