import type { Question } from "./types";

export function filterQuestionsBySubtopics(
  questions: Question[],
  subtopics: string[]
): Question[] {
  return questions.filter((question) => subtopics.includes(question.subtopic));
}
