/**
 * Loads saved notes from local storage.
 * @returns {object} The saved notes object, or an empty object if none are found.
 */
export function loadSavedNotes(){
     return JSON.parse(localStorage.getItem("savedNotes") || "{}");
}

function saveNotes(savedNotes) {
    localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
}


/**
 * Saves a note for a specific question to local storage.
 * @param {string} questionId The ID of the question.
 * @param {string} note The note content to save.
 */
export function saveNote(questionId, note) {
    const savedNotes = loadSavedNotes();
    savedNotes[questionId] = note; 
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
}

/**
 * Finds and returns the note for a specific question.
 * @param {string} questionId The ID of the question.
 * @returns {string} The note content if found, otherwise an empty string.
 */
export function findNote(questionId) {
    const savedNotes = loadSavedNotes();
    return savedNotes.hasOwnProperty(questionId) ? savedNotes[questionId] : "";
}


export function deleteNote(questionId){
    const savedNotes = loadSavedNotes();
    if (!savedNotes[questionId]) return;
    delete savedNotes[questionId];
    saveNotes(savedNotes);
}