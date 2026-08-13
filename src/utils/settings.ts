const STORAGE_KEY = "appSettings";

export const SETTING_AUTO_ADVANCE = "autoAdvanceOnCorrect";
export const MIN_SUCCESS_PERCENTAGE = "minSuccessPercentage";
export const SETTING_SHUFFLE_ANSWERS = "shuffleAnswers";
export const SETTING_RANDOMIZE_QUESTIONS = "randomizeQuestions";
export const SETTING_HIDE_ANSWERS = "hideAnswersDuringTest";

export interface SettingDefinition {
  key: string;
  label: string;
  description: string;
  type?: "switch" | "number";
  min?: number;
  max?: number;
  step?: number;
}

const DEFAULT_SETTINGS: Record<string, boolean | number> = {
  [SETTING_AUTO_ADVANCE]: false,
  [MIN_SUCCESS_PERCENTAGE]: 75,
  [SETTING_SHUFFLE_ANSWERS]: true,
  [SETTING_RANDOMIZE_QUESTIONS]: true,
  [SETTING_HIDE_ANSWERS]: false,
};

export function loadSettings(): Record<string, boolean | number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function getBooleanSetting(key: string): boolean {
  return Boolean(loadSettings()[key]);
}

export function getNumberSetting(key: string, fallback = 0): number {
  const value = loadSettings()[key];
  return typeof value === "number" ? value : fallback;
}

export function setSetting(key: string, value: boolean | number): void {
  const settings = loadSettings();
  settings[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
