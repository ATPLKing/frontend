const STORAGE_KEY = "appSettings";

export const SETTING_AUTO_ADVANCE = "autoAdvanceOnCorrect";

export interface SettingDefinition {
  key: string;
  label: string;
  description: string;
}

const DEFAULT_SETTINGS: Record<string, boolean> = {
  [SETTING_AUTO_ADVANCE]: false,
};

export function loadSettings(): Record<string, boolean> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function getSetting(key: string): boolean {
  return loadSettings()[key] ?? false;
}

export function setSetting(key: string, value: boolean): void {
  const settings = loadSettings();
  settings[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
