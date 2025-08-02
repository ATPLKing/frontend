import { themeHandler } from "./theme.js";
import { clearClasses } from "./utils/helper.js";
import { getAnswerIndices } from "./utils/answer.js";
import { displayTime } from "./utils/time.js";
import { showQuestion, renderNavigationContainer } from "./render.js";

const AllTests = JSON.parse(localStorage.getItem("tests") || "{}");
const testId = localStorage.getItem("current-test-id");
const test = AllTests[testId];

let timeElapsed = test.timeElapsed || 0;

let questions = test.questions;
let userAnswers = test.userAnswers;
let currentIndex = 0;

function initializeApp() {
  // theme handling
  themeHandler();

  // show the first question (initialization)
  showQuestion(questions, currentIndex);
  secondCounter();

  renderNavigationContainer(questions);
  validateQuestionNavButtons();

  // event listeners;
  nextQuestionBtnListener();
  prevQuestionBtnListener();
  questionNavBtnListener();
  answersEventListener();
  pauseTestBtnListener();
  endTestBtnListener();
}

// When the document content loaded
document.addEventListener("DOMContentLoaded", initializeApp);

/**
 * Attaches a click event listener to the "next" button element.
 * When clicked, it triggers the nextQuestion function to advance
 * to the next question in the quiz.
 */
function nextQuestionBtnListener() {
  document.getElementById("next").addEventListener("click", nextQuestion);
}

/**
 * Attaches a click event listener to the "prev" button element.
 * When clicked, it triggers the prevQuestion function to move
 * to the previous question in the quiz.
 */
function prevQuestionBtnListener() {
  document.getElementById("prev").addEventListener("click", prevQuestion);
}

/**
 * Navigates to the following question in the quiz.
 * Decrements the current question index and displays the corresponding question
 * and its answer options using the showQuestion function.
 */
function nextQuestion() {
  if (currentIndex + 1 < questions.length) {
    currentIndex++;
  }
  showQuestion(questions, currentIndex);
  validateAnswers();
}

/**
 * Navigates to the previous question in the quiz.
 * Decrements the current question index and displays the corresponding question
 * and its answer options using the showQuestion function.
 */
function prevQuestion() {
  if (currentIndex - 1 >= 0) {
    currentIndex--;
  }
  showQuestion(questions, currentIndex);
  validateAnswers();
}

/**
 * Adds an event listener to the question navigation buttons within the question grid.
 * When a navigation button is clicked, it retrieves the associated question index
 * from the button's data attribute, validates the index, and updates the current
 * question being displayed by calling the showQuestion function.
 * Ensures that the index is within the valid range of available questions.
 */
function questionNavBtnListener() {
  const questionGrid = document.getElementsByClassName("question-grid")[0];
  if (!questionGrid) return;
  questionGrid.addEventListener("click", function (e) {
    if (e.target && e.target.matches(".question-nav")) {
      const idx = parseInt(e.target.dataset.questionIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < questions.length) {
        currentIndex = idx;
        showQuestion(questions, currentIndex);
        validateAnswers();
      }
    }
  });
}

function answerQuestion(Questionindex, optionIndex) {
  userAnswers[Questionindex] = optionIndex;
  test.userAnswers = userAnswers;
  AllTests[testId] = test;
  localStorage.setItem("tests", JSON.stringify(AllTests));
  validateAnswers();
  validateQuestionNavButtons();
}

/**
 * Attaches click event listeners to all quiz option buttons.
 * When an option is clicked, it triggers the answerQuestion function
 * with the current question index and the selected option.
 */
function answersEventListener() {
  const optionsContainer = document.getElementById("answer-options-container");
  if (!optionsContainer) return;
  optionsContainer.addEventListener("click", function (e) {
    const answerEl = e.target.closest(".answer");

    if (!answerEl || !optionsContainer.contains(answerEl)) return;

    if (userAnswers.hasOwnProperty(currentIndex)) return;

    const selectedOptionIndex = answerEl.dataset.optionIndex;
    if (selectedOptionIndex === undefined) return;
    answerQuestion(currentIndex, selectedOptionIndex);
  });
}

/**
 * Validates the user's answer for the current question by comparing it with the correct answer.
 * Highlights the correct and incorrect options in the answer options container.
 *
 * Retrieves the current question and user's answer based on the current index.
 * If the correct answer index is found, it adds a "correct" class to the corresponding option.
 * If the user's answer is incorrect, it adds an "incorrect" class to the user's selected option.
 * Clears any previous "correct" or "incorrect" classes from the answer options container.
 */
function validateAnswers() {
  const container = document.getElementById("answer-options-container");
  const question = questions[currentIndex];
  if (!container || !question || !userAnswers.hasOwnProperty(currentIndex))
    return;

  const { correctIndex, userIndex } = getAnswerIndices(
    question,
    userAnswers[currentIndex]
  );

  clearClasses(Array.from(container.children), "correct", "incorrect");

  if (correctIndex !== -1) {
    container.children[correctIndex].classList.add("correct");
  }

  if (userIndex !== correctIndex && userIndex !== undefined) {
    container.children[userIndex].classList.add("incorrect");
  }
}

/**
 * Validates and updates the navigation buttons for each question based on user answers.
 *
 * This function selects all elements with the class "question-nav" and iterates over them.
 * For each button, it retrieves the associated question index from the button's dataset,
 * and uses this index to access the corresponding question and user answer.
 *
 * It removes any existing "correct" or "incorrect" classes from the button.
 * If the question or user answer is not available, the function exits early for that button.
 *
 * The function then determines the correct and user-selected answer indices using the
 * `getAnswerIndices` function. It adds the "correct" class to the button if the user's
 * answer matches the correct answer, otherwise it adds the "incorrect" class.
 */
function validateQuestionNavButtons() {
  const navButtons = document.querySelectorAll(".question-nav");
  navButtons.forEach((btn) => {
    const index = parseInt(btn.dataset.questionIndex, 10);
    const question = questions[index];

    btn.classList.remove("correct", "incorrect");

    if (!question || !userAnswers.hasOwnProperty(index)) return;

    const { correctIndex, userIndex } = getAnswerIndices(
      question,
      userAnswers[index]
    );

    btn.classList.add(userIndex === correctIndex ? "correct" : "incorrect");
  });
}

function endTestBtnListener() {
  document.getElementById("end-test").addEventListener("click", endTest);
}

function endTest() {
  if (userAnswers.length != questions.length) {
    const unanswered_questions = questions.length - userAnswers.length;
    alertify.alert(
      "Test incomplet",
      `Vous devez répondre à toutes les questions pour terminer le test ! Il vous reste ${unanswered_questions} questions sans réponse !`
    );
  } else {
    alertify
      .confirm(`Êtes-vous sûr de vouloir terminer le test ?`)
      .set("title", "Terminer le test")
      .set("labels", { ok: "OUI", cancel: "NON" })
      .set("onok", function () {
        test.timeElapsed = timeElapsed;
        test.saveAt = new Date().toISOString();
        AllTests[testId] = test;
        localStorage.setItem("tests", JSON.stringify(AllTests));
        window.location.href = "/result";
      })
      .set("oncancel", function () {});
  }
}

function pauseTestBtnListener() {
  document.getElementById("pause-test").addEventListener("click", pauseTest);
}

function pauseTest() {
  alertify
    .confirm(`Êtes-vous sûr de vouloir terminer le test ?`)
    .set("title", "Enregistrer le test")
    .set("labels", { ok: "OUI", cancel: "NON" })
    .set("onok", function () {
      test.timeElapsed = timeElapsed;
      test.saveAt = new Date().toISOString();
      AllTests[testId] = test;
      localStorage.setItem("tests", JSON.stringify(AllTests));
      window.location.href = "/historic";
    })
    .set("oncancel", function () {});
}

/**
 * Increments the given timeElapsed variable every second.
 *
 */
export function secondCounter() {
  const timerSpan = document.getElementById("timer");
  setInterval(() => {
    timeElapsed++;
    displayTime(timerSpan, timeElapsed);
  }, 1000);
}
