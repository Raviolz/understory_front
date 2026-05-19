const API_BASE_URL = "http://localhost:3001"

export function apiRequest(path, options = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json()
  })
}
