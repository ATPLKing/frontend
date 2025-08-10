import { themeHandler } from "./theme.js";
import { fillHistoricTableRows } from "./render.js";
import {
  loadSavedTests,
  createTest,
  deleteTest,
  startTest,
  saveTest,
} from "./utils/test.js";

const savedTests = loadSavedTests();

function initializeApp() {
  themeHandler();
  fillHistoricTableRows(savedTests);
  setupHistoricTableActions();

  $(document).ready(function () {
    $("#historic-table").DataTable({
      responsive: true,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json",
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);

function setupHistoricTableActions() {
  document
    .querySelector("#historic-table tbody")
    .addEventListener("click", function (e) {
      const tr = e.target.closest("tr");
      if (!tr) return;

      const testId = tr.getAttribute("data-test-id");

      if (e.target.closest(".result")) {
        handleShowTestResult(testId);
      } else if (e.target.closest(".test")) {
        handleOpenTest(testId);
      } else if (e.target.closest(".delete")) {
        handleDeleteTest(testId);
      } else if (e.target.closest(".retest")) {
        handleRetest(testId);
      }
    });
}


/**
 * Handles showing the result of a specific test.
 * It verifies if the test is complete before storing its ID in localStorage
 * and redirecting the user to the results page.
 * @param {string} testId - The ID of the test to display.
 */
function handleShowTestResult(testId) {
  const test = savedTests[testId];
  if (test.questions.length != test.userAnswers.length) {
    alertify.alert(
      "Test incomplet",
      "Impossible d'acceder aux résultats, veuillez terminer le test !"
    );
    return;
  }

  localStorage.setItem("current-test-id", testId);
  window.location.href = "/result";
}


/**
 * Sets the current test ID in local storage and redirects to the quiz page.
 * @param {string | number} testId The ID of the test to be opened.
 */
function handleOpenTest(testId) {
  localStorage.setItem("current-test-id", testId);
  window.location.href = "/quiz";
}


/**
 * Handles the deletion of a test after user confirmation.
 * Displays a confirmation dialog using alertify. If confirmed,
 * it deletes the test, shows a success notification, and redirects
 * to the historic page.
 * @param {string} testId - The ID of the test to be deleted.
 */
function handleDeleteTest(testId) {
  alertify
    .confirm(`Êtes-vous sûr de vouloir supprimer le test ?`)
    .set("title", "Supprimer le test")
    .set("labels", { ok: "OUI", cancel: "NON" })
    .set("onok", function () {
      const test = savedTests[testId];
      deleteTest(test);
      alertify.success("Test supprimé");

      setTimeout(() => {
        window.location.href = "/historic";
      }, 2000);
    })
    .set("oncancel", function () {});
}


/**
 * Prompts the user to confirm restarting a test.
 * If confirmed, creates a new test using the parameters of the old test,
 * saves it, and starts the quiz.
 * @param {string} testId - The ID of the test to be retaken.
 */
function handleRetest(testId) {
  alertify
    .confirm(`Êtes-vous sûr de vouloir recommencer ce test ?`)
    .set("title", "Recommencer le test")
    .set("labels", { ok: "OUI", cancel: "NON" })
    .set("onok", function () {
      const oldTest = savedTests[testId];
      const newTest = createTest(oldTest.params);
      saveTest(newTest);
      startTest(newTest);
    })
    .set("oncancel", function () {});
}
