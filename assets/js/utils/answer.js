/**
 * Determines the indices of the correct answer and the user's answer.
 *
 * @param {Object} question - The question object containing options.
 * @param {string} userAnswer - The user's answer as a string.
 * @returns {Object} An object containing the indices of the correct answer and the user's answer.
 * @property {number} correctIndex - The index of the correct option.
 * @property {number} userIndex - The index of the user's selected option.
 */
export function getAnswerIndices(question, userAnswer) {
  const correctIndex = question.options.findIndex(opt => opt.correct);
  const userIndex = parseInt(userAnswer, 10);
  return { correctIndex, userIndex };
}

/**
 * Builds a dictionary mapping question indices to a tuple of user answer index and correct answer index.
 *
 * @param {Array<Object>} questions - Array of question objects.
 * @param {Array<number>} userAnswers - Array of user answer indices, each corresponding to a question.
 * @returns {Object} Dictionary with question index as key and [userIndex, correctIndex] as value.
 */
export function buildAnswerDict(questions, userAnswers) {
  const answerDict = {};
  questions.forEach((question, idx) => {
    const correctIndex = question.options.findIndex(opt => opt.correct);
    const userIndex = Number(userAnswers[idx]);
    answerDict[idx] = [userIndex, correctIndex];
  });
  return answerDict;
}




/**
 * Calculates the number of correct answers and the total number of questions.
 *
 * @param {Array<Object>} questions - Array of question objects.
 * @param {Array<number>} userAnswers - Array of user answer indices.
 * @returns {Array<number>} An array with [correctCount, totalQuestions].
 *
 */
export function getAnswerScores(questions, userAnswers) {
  const answerDict = buildAnswerDict(questions, userAnswers);
  const total = questions.length;
  let correct = 0;
  Object.values(answerDict).forEach(([userIndex, correctIndex]) => {
    if (userIndex === correctIndex) correct++;
  });
  return [correct, total];
}

/**
 * Calculates the percentage of correct and incorrect answers.
 *
 * @param {Array<Object>} questions - Array of question objects.
 * @param {Array<number>} userAnswers - Array of user answer indices.
 * @returns {Array<number>} An array with [percentageCorrect, percentageIncorrect].
 *
 */

export function getAnswerPercentages(questions, userAnswers) {
  const answerDict = buildAnswerDict(questions, userAnswers);
  const total = questions.length;
  let correct = 0;
  Object.values(answerDict).forEach(([userIndex, correctIndex]) => {
    if (userIndex === correctIndex) correct++;
  });
  const percentageCorrect = total === 0 ? 0 : Math.round((correct / total) * 100);
  const percentageIncorrect = 100 - percentageCorrect;
  return [percentageCorrect, percentageIncorrect];
}