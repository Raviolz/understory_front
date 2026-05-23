import { apiRequest } from "./apiClient"

export function getCities() {
  return apiRequest("/cities")
}
