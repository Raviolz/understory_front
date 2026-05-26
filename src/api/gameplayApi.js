import { authenticatedRequest } from "./apiClient"

export function submitQuizAnswer(answerData) {
  return authenticatedRequest("/gameplay/quiz-answer", {
    method: "POST",
    body: JSON.stringify(answerData),
  })
}

export function submitUploadSubmission(experienceId, file) {
  const formData = new FormData()
  formData.append("experienceId", experienceId)
  formData.append("file", file)

  return authenticatedRequest("/gameplay/upload-submissions", {
    method: "POST",
    body: formData,
  })
}
