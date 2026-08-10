import { generateID } from "./helper";
import type { Test, TestParams } from "./types";

const SAVED_TESTS_KEY = "savedTests";
const CURRENT_TEST_ID_KEY = "current-test-id";

export function loadSavedTests(): Record<string, Test> {
  return JSON.parse(localStorage.getItem(SAVED_TESTS_KEY) || "{}");
}

export function saveTest(test: Test): void {
  const savedTests = loadSavedTests();
  savedTests[test.id] = test;
  localStorage.setItem(SAVED_TESTS_KEY, JSON.stringify(savedTests));
}

export function deleteTest(test: Test): void {
  const savedTests = loadSavedTests();
  delete savedTests[test.id];
  localStorage.setItem(SAVED_TESTS_KEY, JSON.stringify(savedTests));
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
