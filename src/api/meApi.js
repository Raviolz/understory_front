import { authenticatedRequest } from "./apiClient"

export function getMyJournal({ page = 0, size = 50, sortBy = "completedAt" } = {}) {
  return authenticatedRequest(`/me/journal?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function updateMyProgressNote(progressId, userNote) {
  return authenticatedRequest(`/me/progress/${progressId}/note`, {
    method: "PATCH",
    body: JSON.stringify({ userNote }),
  })
}

export function getMyRewards({ page = 0, size = 50, sortBy = "unlockedAt" } = {}) {
  return authenticatedRequest(`/me/rewards?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function createMyBooking(bookingData) {
  return authenticatedRequest("/me/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
  })
}

export function getMyBookings({ page = 0, size = 50, sortBy = "bookingDate" } = {}) {
  return authenticatedRequest(`/me/bookings?page=${page}&size=${size}&sortBy=${sortBy}`)
}

export function cancelMyBooking(bookingId) {
  return authenticatedRequest(`/me/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  })
}
