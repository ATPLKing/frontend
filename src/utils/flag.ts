export const FLAG_NONE = 0;
export const FLAG_RED = 1;
export const FLAG_YELLOW = 2;
export const FLAG_GREEN = 3;

export const flagColors: Record<number, string> = {
  [FLAG_RED]: "#e53935",
  [FLAG_YELLOW]: "#f9a825",
  [FLAG_GREEN]: "#43A047",
};

export const flagButtonOrder = [FLAG_RED, FLAG_YELLOW, FLAG_GREEN];

export function loadSavedFlags(): Record<string, number> {
  return JSON.parse(localStorage.getItem("savedFlags") || "{}");
}

function saveFlags(savedFlags: Record<string, number>): void {
  localStorage.setItem("savedFlags", JSON.stringify(savedFlags));
}

export function setQuestionFlag(questionId: string, value: number): void {
  const savedFlags = loadSavedFlags();
  if (value === FLAG_NONE) {
    if (!savedFlags[questionId]) return;
    delete savedFlags[questionId];
  } else {
    savedFlags[questionId] = value;
  }
  saveFlags(savedFlags);
}

export function getQuestionFlag(questionId: string): number {
  const savedFlags = loadSavedFlags();
  return Object.prototype.hasOwnProperty.call(savedFlags, questionId)
    ? savedFlags[questionId]
    : FLAG_NONE;
}
