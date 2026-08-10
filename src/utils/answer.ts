import type { Question } from "./types";

export interface AnswerIndices {
  correctIndex: number;
  userIndex: number;
}

export function getAnswerIndices(
  question: Question,
  userAnswer: number | string | null | undefined
): AnswerIndices {
  const correctIndex = question.options.findIndex((opt) => opt.correct);
  const userIndex =
    userAnswer === undefined || userAnswer === null
      ? -1
      : Number.parseInt(String(userAnswer), 10);
  return { correctIndex, userIndex };
}

export function buildAnswerDict(
  questions: Question[],
  userAnswers: (number | string | null | undefined)[]
): Record<number, [number, number]> {
  const answerDict: Record<number, [number, number]> = {};
  questions.forEach((question, idx) => {
    const correctIndex = question.options.findIndex((opt) => opt.correct);
    const userIndex = Number(userAnswers[idx]);
    answerDict[idx] = [userIndex, correctIndex];
  });
  return answerDict;
}

export function getAnswerScores(
  questions: Question[],
  userAnswers: (number | string | null | undefined)[]
): [number, number] {
  const answerDict = buildAnswerDict(questions, userAnswers);
  const total = questions.length;
  let correct = 0;
  Object.values(answerDict).forEach(([userIndex, correctIndex]) => {
    if (userIndex === correctIndex) correct++;
  });
  return [correct, total];
}

export function getAnswerPercentages(
  questions: Question[],
  userAnswers: (number | string | null | undefined)[]
): [number, number] {
  const answerDict = buildAnswerDict(questions, userAnswers);
  const total = questions.length;
  let correct = 0;
  Object.values(answerDict).forEach(([userIndex, correctIndex]) => {
    if (userIndex === correctIndex) correct++;
  });
  const percentageCorrect =
    total === 0 ? 0 : Math.round((correct / total) * 100);
  const percentageIncorrect = 100 - percentageCorrect;
  return [percentageCorrect, percentageIncorrect];
}
