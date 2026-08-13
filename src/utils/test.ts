import { generateID } from "./helper";
import type { Test, TestParams } from "./types";

const SAVED_TESTS_KEY = "savedTests";
const CURRENT_TEST_ID_KEY = "current-test-id";
const SEEN_QUESTION_IDS_KEY = "seenQuestionIds";

export function loadSavedTests(): Record<string, Test> {
  return JSON.parse(localStorage.getItem(SAVED_TESTS_KEY) || "{}");
}

export function saveTest(test: Test): void {
  const savedTests = loadSavedTests();
  savedTests[test.id] = test;
  localStorage.setItem(SAVED_TESTS_KEY, JSON.stringify(savedTests));
  const seen = readSeenIds() ?? new Set<string>();
  test.questions.forEach((q) => seen.add(q.id));
  persistSeenIds(seen);
}

export function deleteTest(test: Test): void {
  const savedTests = loadSavedTests();
  delete savedTests[test.id];
  localStorage.setItem(SAVED_TESTS_KEY, JSON.stringify(savedTests));
  const seen = readSeenIds();
  if (seen) {
    test.questions.forEach((q) => seen.delete(q.id));
    persistSeenIds(seen);
  }
}

export function createTest(params: TestParams): Test {
  const test: Test = {
    id: generateID(),
    mode: params.mode,
    bankId: params.bankId,
    bankName: params.bankName,
    subject: params.subject,
    createdAt: new Date().toISOString(),
    questions: params.questions,
    userAnswers: [],
    params,
  };
  return test;
}

export function setCurrentTestId(id: string): void {
  localStorage.setItem(CURRENT_TEST_ID_KEY, id);
}

export function clearCurrentTestId(): void {
  localStorage.removeItem(CURRENT_TEST_ID_KEY);
}

export function getCurrentTest(): Test | null {
  const savedTests = loadSavedTests();
  const testId = localStorage.getItem(CURRENT_TEST_ID_KEY);
  return testId ? savedTests[testId] ?? null : null;
}

function readSeenIds(): Set<string> | null {
  const raw = localStorage.getItem(SEEN_QUESTION_IDS_KEY);
  if (raw === null) return null;
  try {
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function persistSeenIds(ids: Set<string>): void {
  localStorage.setItem(SEEN_QUESTION_IDS_KEY, JSON.stringify([...ids]));
}

export function getSeenQuestionIds(): Set<string> {
  const seen = readSeenIds();
  if (seen !== null) return seen;
  const migrated = new Set<string>();
  Object.values(loadSavedTests()).forEach((test) =>
    test.questions.forEach((q) => migrated.add(q.id))
  );
  persistSeenIds(migrated);
  return migrated;
}
