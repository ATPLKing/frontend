export function loadSavedNotes(): Record<string, string> {
  return JSON.parse(localStorage.getItem("savedNotes") || "{}");
}

function saveNotes(savedNotes: Record<string, string>): void {
  localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
}

export function saveNote(questionId: string, note: string): void {
  const savedNotes = loadSavedNotes();
  savedNotes[questionId] = note;
  saveNotes(savedNotes);
}

export function findNote(questionId: string): string {
  const savedNotes = loadSavedNotes();
  return Object.prototype.hasOwnProperty.call(savedNotes, questionId)
    ? savedNotes[questionId]
    : "";
}

export function deleteNote(questionId: string): void {
  const savedNotes = loadSavedNotes();
  if (!savedNotes[questionId]) return;
  delete savedNotes[questionId];
  saveNotes(savedNotes);
}
