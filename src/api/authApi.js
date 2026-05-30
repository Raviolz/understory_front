import { apiRequest, authenticatedRequest } from "./apiClient"

export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function getMyProfile() {
  return authenticatedRequest("/me/profile")
}

export function updateMyProfile(profileData) {
  return authenticatedRequest("/me/profile", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  })
}

export function getMyCityKnowledge() {
  return authenticatedRequest("/me/city-knowledge")
}

export function uploadMyAvatar(file) {
  const formData = new FormData()
  formData.append("file", file)

  return authenticatedRequest("/me/avatar", {
    method: "PATCH",
    body: formData,
  })
}
