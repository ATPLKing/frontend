import { themeHandler } from "./theme.js";
import { showQuestion, renderNavigationContainer } from "./render.js";

let questions = [];
let currentIndex = 0;

function initializeApp() { 
    // theme handling
    themeHandler();

    loadQuestions();
    // show the first question (initialization)
    showQuestion(questions, currentIndex);
    renderNavigationContainer(questions);

    // event listeners;
    nextQuestionBtnListener();
    prevQuestionBtnListener();
    questionNavBtnListener();
}


// When the document content loaded
document.addEventListener("DOMContentLoaded", initializeApp); 



function loadQuestions() {
    questions = JSON.parse(localStorage.getItem("questions"));
    console.log(questions);
}


/**
 * Attaches a click event listener to the "next" button element.
 * When clicked, it triggers the nextQuestion function to advance
 * to the next question in the quiz.
 */
function nextQuestionBtnListener(){
    document.getElementById("next").addEventListener("click", nextQuestion)
}

/**
 * Attaches a click event listener to the "prev" button element.
 * When clicked, it triggers the prevQuestion function to move
 * to the previous question in the quiz.
 */
function prevQuestionBtnListener(){
    document.getElementById("prev").addEventListener("click", prevQuestion)
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
            }
        }
    });
}

