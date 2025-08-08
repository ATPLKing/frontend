import { themeHandler } from "./theme.js";
import { fillHistoricTableRows } from "./render.js";
import { loadSavedTests } from "./utils/test.js";

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
      }
    });
}

function handleShowTestResult(testId) {
  const test = AllTests[testId];
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

function handleOpenTest(testId) {
  localStorage.setItem("current-test-id", testId);
  window.location.href = "/quiz";
}

function handleDeleteTest(testId) {
  alertify
    .confirm(`Êtes-vous sûr de vouloir supprimer le test ?`)
    .set("title", "Supprimer le test")
    .set("labels", { ok: "OUI", cancel: "NON" })
    .set("onok", function () {
      delete AllTests[testId];
      localStorage.setItem("tests", JSON.stringify(AllTests));
      window.location.href = "/historic";
    })
    .set("oncancel", function () {});
}
