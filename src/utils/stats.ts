import type { Question, SubjectMetadata, SubjectStats } from "./types";

export function countQuestionsPerSubject(
  questions: Question[],
  metadata: SubjectMetadata[]
): SubjectStats[] {
  const questionsCountPerSubtopic = countQuestionsPerSubtopic(questions);

  const stats = metadata.map((subject) => {
    const subtopics = subject.subtopics.map((sub) => ({
      code: sub.code,
      name: sub.name,
      count: questionsCountPerSubtopic[sub.code] || 0,
    }));

    const total = subtopics.reduce((acc, sub) => acc + sub.count, 0);

    return {
      code: subject.code,
      name: subject.name,
      total,
      subtopics,
    };
  });

  return stats;
}

function countQuestionsPerSubtopic(questions: Question[]): Record<string, number> {
  return questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.subtopic] = (acc[q.subtopic] || 0) + 1;
    return acc;
  }, {});
}
