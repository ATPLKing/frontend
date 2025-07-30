import { themeHandler } from "./theme.js";
import { getQuestionsByUV, getUVs, getMetadatabyUV } from "./api.js";
import {
  TestQuestionsOptions,
  renderSubjectAccordion,
  fillUVsOptions,
  showTestOptions,
  hideTestOptions,
} from "./render.js";
import { shuffleArray } from "./utils/array.js";
import { countQuestionsPerSubject } from "./utils/stats.js";
import {
  filterQuestionsByDatabase,
  filterQuestionsBySubtopics
} from "./utils/question.js";
import { generateID } from "./utils/helper.js";


const AllTests = JSON.parse(localStorage.getItem("tests") || "{}");
let selectedDatabase = null;
let UVs = [];
let selectedUV = null;
let UVMetadata = [];
let questions = [];
let questionsCopy = [];
let questionsCountPerSubject = [];
let desiredQuestionsCount = null;
let selectedSubtopics = [];
let finalTestQuestions = [];

async function initializeApp() {
  // theme handler
  themeHandler();

  // get UVs from api and fetch option in UV Select
  UVs = await getUVs();
  fillUVsOptions(UVs);


  // Listeners
  testBtnListener();
  UVChangeListener();
  subtopicsChangeListener();
  databaseChangeListener();
  startTestBtnListener();
}

// When the document content loaded
document.addEventListener("DOMContentLoaded", initializeApp);



/**
 * Adds a click event listener to the "test-btn" element.
 * When clicked, it retrieves the selected UV from the "uv-select" element.
 * If no UV is selected, it displays a warning message.
 * Otherwise, it triggers the onUVChange function with the selected UV.
 */
function testBtnListener() {
  document.getElementById("test-btn").addEventListener("click", () => {
    selectedUV = document.getElementById("uv-select").value;
    if (!selectedUV) {
      alertify.warning("Veuillez sélectionner une UV");
      return;
    }
    onUVChange({ target: { value: selectedUV } });
  });
}

/**
 * Attaches an event listener to the UV selection element.
 *
 * This function adds a 'change' event listener to the HTML element with the ID 'uv-select'.
 * When the selected value changes, it triggers the `onUVChange` function to handle the event.
 */
function UVChangeListener() {
  document.getElementById("uv-select").addEventListener("change", onUVChange);
}

/**
 * Handles the change event for the UV selection.
 * Updates the selected UV and fetches its metadata and questions.
 * If valid data is retrieved, it calculates the question count per subject,
 * renders the subject accordion, updates the test questions options,
 * and displays the test options.
 */
async function onUVChange(event) {
  selectedUV = event.target.value;
  if (!selectedUV) {
    hideTestOptions();
    return;
  }

  UVMetadata = await getMetadatabyUV(selectedUV);
  questions = await getQuestionsByUV(selectedUV);

  // make a copy of questions (before processing)
  questionsCopy = questions;

  selectedDatabase = document.querySelector(
    'input[name="db-select"]:checked'
  )?.value;

  if (UVMetadata && questions) {
    questionsCopy = filterQuestionsByDatabase(questions, selectedDatabase);
    questionsCountPerSubject = countQuestionsPerSubject(
      questionsCopy,
      UVMetadata
    );
    renderSubjectAccordion(questionsCountPerSubject);
    TestQuestionsOptions(questionsCopy);
    showTestOptions();
  }
}

/**
 * Attaches a change event listener to the database selection input element.
 * When the selected database changes, the onDatabaseChange function is triggered
 * to update the questions and UI accordingly.
 */
function databaseChangeListener() {
  document.querySelectorAll('input[name="db-select"]').forEach((input) => {
    input.addEventListener("change", onDatabaseChange);
  });
}

/**
 * Handles the change event for the database selection.
 * Updates the selected database, filters questions based on the selected database,
 * counts questions per subject, renders the subject accordion, and updates test question options.
 */
function onDatabaseChange() {
  selectedDatabase = document.querySelector(
    'input[name="db-select"]:checked'
  )?.value;
  questionsCopy = filterQuestionsByDatabase(questions, selectedDatabase);
  questionsCountPerSubject = countQuestionsPerSubject(
    questionsCopy,
    UVMetadata
  );
  renderSubjectAccordion(questionsCountPerSubject);
  TestQuestionsOptions(questionsCopy);
}

/**
 * Attaches a change event listener to the subject accordion element.
 *
 * The listener triggers the `onSubtopicsChange` function when a checkbox
 * within the accordion is changed.
 */
function subtopicsChangeListener() {
  const accordion = document.getElementById("subjectAccordion");

  if (!accordion) return;

  accordion.addEventListener("change", function (event) {
    if (event.target.matches('input[type="checkbox"]')) {
      onSubtopicsChange();
    }
  });
}

/**
 * Updates the selected subtopics and filters questions based on the selected subtopics.
 * Also updates the UI elements to reflect the number of questions available.
 */
function onSubtopicsChange() {
  selectedSubtopics = getCheckedSubtopics();
  questionsCopy = filterQuestionsBySubtopics(questions, selectedSubtopics);
  TestQuestionsOptions(questionsCopy);
}

/**
 * Retrieves the values of all checked subtopic checkboxes within the subject accordion.
 *
 * @returns {string[]} An array of values from the checked checkboxes.
 */
function getCheckedSubtopics() {
  const checkedSubtopics = Array.from(
    document.querySelectorAll(
      '#subjectAccordion .accordion-body input[type="checkbox"]:checked'
    )
  ).map((input) => input.value);
  return checkedSubtopics;
}


/**
 * Attaches a click event listener to the "start-btn" element.
 * When the button is clicked, the `startTest` function is triggered.
 */
function startTestBtnListener() {
  document.getElementById("start-btn").addEventListener("click", startTest);
}




function startTest() {
  
  desiredQuestionsCount = document.getElementById("desired-questions-count").value;

 if (questionsCopy.length == 0) {
    alertify.warning("La sélection de question ne contient aucune question.");
    return;
  };

  if (desiredQuestionsCount <= 0 || desiredQuestionsCount > questionsCopy.length) {
    alertify.warning(`Entrez un nombre de questions compris entre 1 et ${questionsCopy.length}.`)
    return;
  }

  // shuffle questions and options
  questionsCopy = shuffleArray(questionsCopy);
  questionsCopy.forEach(question => question.options = shuffleArray(question.options));
  finalTestQuestions = questionsCopy.slice(0, desiredQuestionsCount);

  

  const testId = generateID();
  // Find the selected UV object from the UVs array
  const selectedUVObj = UVs.find(uv => uv.id === selectedUV);

  const test = {
    id: testId,
    mode: 'TEST',
    database: selectedDatabase == 'H' ? 'HELICOPTERE' : 'AVION',
    uv: selectedUVObj ? `${selectedUVObj.id} - ${selectedUVObj.name}` : '',
    createdAt: new Date().toISOString(),
    questions: finalTestQuestions,
    userAnswers: []
  }

  localStorage.setItem(`test-${testId}`, JSON.stringify(test));
  localStorage.setItem("current-test-id", testId);


  // update list of test ids
  AllTests.testId = test;
  localStorage.setItem("tests", JSON.stringify(AllTests));


  window.location.href = "quiz";
}
