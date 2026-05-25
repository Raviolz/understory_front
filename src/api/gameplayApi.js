import { authenticatedRequest } from "./apiClient"

export function submitQuizAnswer(answerData) {
  return authenticatedRequest("/gameplay/quiz-answer", {
    method: "POST",
    body: JSON.stringify(answerData),
  })
}
