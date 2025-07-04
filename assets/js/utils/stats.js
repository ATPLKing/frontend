/**
 * Generates statistics for questions grouped by subject and subtopic.
 *
 * This function takes an array of questions and metadata about subjects,
 * and returns an array of objects representing each subject. Each object
 * contains the subject's code and name, the total number of questions for
 * that subject, and a list of subtopics with their respective question counts.
 *
 * @param {Array} questions - An array of question objects, each containing a subtopic code.
 * @param {Array} metadata - An array of subject metadata objects, each containing a code, name, and subtopics.
 * @returns {Array} An array of objects, each representing a subject with its code, name, total question count, and subtopics.
 */
function countQuestionsPerSubject(questions, metadata) {
  const questionsCountPerSubtopic = countQuestionsPerSubtopic(questions);

  const stats = metadata.map((subject) => {
    const subjectCode = subject.code;
    const subjectName = subject.name;

    // Build list of subtopics with counts
    const subtopics = subject.subtopics.map((sub) => {
      const count = questionsCountPerSubtopic[sub.code] || 0;
      return {
        code: sub.code,
        name: sub.name,
        count,
      };
    });

    // Total count for subject
    const total = subtopics.reduce((acc, sub) => acc + sub.count, 0);

    return {
      code: subjectCode,
      name: subjectName,
      total,
      subtopics,
    };
  });

  return stats;
}

/**
 * Counts the number of questions per subtopic.
 * @param {Array} questions - Array of question objects with a 'subtopic' key.
 * @returns {Object} An object with subtopic keys and their question counts.
 */
function countQuestionsPerSubtopic(questions) {
  return questions.reduce((acc, q) => {
    acc[q.subtopic] = (acc[q.subtopic] || 0) + 1;
    return acc;
  }, {});
}

export { countQuestionsPerSubject };
