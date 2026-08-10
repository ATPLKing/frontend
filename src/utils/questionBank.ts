import { sampleBank } from "../data/sampleBank";
import { generateID } from "./helper";
import type { QuestionBank } from "./types";

const QUESTION_BANKS_KEY = "questionBanks";

function readQuestionBanks(): QuestionBank[] {
  try {
    const raw = localStorage.getItem(QUESTION_BANKS_KEY);
    return raw ? (JSON.parse(raw) as QuestionBank[]) : [];
  } catch {
    return [];
  }
}

function writeQuestionBanks(banks: QuestionBank[]): void {
  localStorage.setItem(QUESTION_BANKS_KEY, JSON.stringify(banks));
}

export function loadQuestionBanks(): QuestionBank[] {
  const banks = readQuestionBanks();
  if (banks.length === 0) {
    writeQuestionBanks([sampleBank]);
    return [sampleBank];
  }
  return banks;
}

export function getQuestionBank(id: string): QuestionBank | null {
  return readQuestionBanks().find((bank) => bank.id === id) ?? null;
}

export function saveQuestionBank(bank: QuestionBank): void {
  const banks = readQuestionBanks();
  const index = banks.findIndex((b) => b.id === bank.id);
  if (index >= 0) {
    banks[index] = bank;
  } else {
    banks.push(bank);
  }
  writeQuestionBanks(banks);
}

export function deleteQuestionBank(id: string): void {
  const banks = readQuestionBanks().filter((bank) => bank.id !== id);
  writeQuestionBanks(banks);
}

export function createQuestionBank(
  name: string,
  description: string
): QuestionBank {
  return {
    id: generateID(),
    name,
    description,
    subjects: [],
    questions: [],
  };
}
