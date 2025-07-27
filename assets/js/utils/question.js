/**
 * Filters questions based on a given list of subtopics.
 *
 * @param {Array} questions - The array of question objects to filter.
 * @param {Array} subtopics - The list of subtopics to filter by.
 * @returns {Array} The filtered array of questions.
 */
function filterQuestionsBySubtopics(questions, subtopics) {
  return questions.filter((question) => subtopics.includes(question.subtopic));
}

/**
 * Filters questions based on a given database key.
 *
 * @param {Array} questions - The array of question objects to filter.
 * @param {string} databaseKey - The key of database to filter by.
 * @returns {Array} The filtered array of questions.
 */
function filterQuestionsByDatabase(questions, databaseKey) {
  const databaseFilter = ["", databaseKey]; // blank added to get non restricted questions
  return questions.filter((question) =>
    databaseFilter.includes(question.database)
  );
}

export { filterQuestionsBySubtopics, filterQuestionsByDatabase};
