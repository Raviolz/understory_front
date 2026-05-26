import { authenticatedRequest } from "./apiClient"

export function getMyJournal({ page = 0, size = 20, sortBy = "completedAt" } = {}) {
  return authenticatedRequest(`/me/journal?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function updateMyProgressNote(progressId, userNote) {
  return authenticatedRequest(`/me/progress/${progressId}/note`, {
    method: "PATCH",
    body: JSON.stringify({ userNote }),
  })
}
