const API_BASE_URL = "http://localhost:3001"

function buildHeaders(options = {}, token = null) {
  const isFormData = options.body instanceof FormData

  const headers = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  return headers
}

export function apiRequest(path, options = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json()
  })
}

export function authenticatedRequest(path, options = {}) {
  const token = localStorage.getItem("accessToken")

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options, token),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json()
  })
}
