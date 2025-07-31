import { buildAnswerDict } from "./utils/answer.js";

/**
 * Renders an accordion UI component with subjects and their subtopics.
 *
 * @param {Array} data - An array of subject objects, each containing a name, code, count, and subtopics.
 *                       Each subtopic includes a title and count.
 *
 * This function clears the existing content of the element with the ID "subjectAccordion"
 * and populates it with accordion items for each subject. Each accordion item includes
 * a collapsible section with checkboxes for subtopics.
 */

function renderSubjectAccordion(data) {
  const accordion = document.getElementById("subjectAccordion");
  accordion.innerHTML = "";

  data.forEach((subject, index) => {
    const subjectId = `subject-${subject.code}`;

    const subtopicsHtml = subject.subtopics
      .map(
        (sub) => `
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-check-label">
              <input class="form-check-input me-2" id="${sub.code}" value="${sub.code}" type="checkbox" checked />
              ${sub.code} - ${sub.name}
            </label>
            <span class="badge bg-secondary">${sub.count}</span>
          </div>`
      )
      .join("");

    const itemHtml = `
      <div class="border rounded mb-2">
        <div class="d-flex align-items-center justify-content-between p-2 subject-header" style="cursor: pointer;" data-target="#${subjectId}">
          <div class="d-flex align-items-center">
            <input class="form-check-input me-2" id="${subject.code}" type="checkbox" checked />
            ${subject.code} ${subject.name}
          </div>
          <span class="badge bg-secondary">${subject.total}</span>
        </div>
        <div id="${subjectId}" class="subject-body px-4 py-2" style="display: none;">
          ${subtopicsHtml}
        </div>
      </div>`;

    accordion.insertAdjacentHTML("beforeend", itemHtml);
  });

  setupAccordionCheckboxSync();

  // Toggle logic
  document.querySelectorAll(".subject-header").forEach((header) => {
    header.addEventListener("click", () => {
      const targetId = header.getAttribute("data-target");
      const target = document.querySelector(targetId);
      target.style.display = target.style.display === "none" ? "block" : "none";
    });
  });

}


/**
 * fill the UV options in the UV select
 * @param {Array} uvs - Array containing the us
 */
function fillUVsOptions(UVs) {
  const uvSelect = document.getElementById("uv-select");
  if (UVs && uvSelect) {
    UVs.forEach((uv) => {
      const option = document.createElement("option");
      option.value = uv.id;
      option.textContent = `${uv.id} - ${uv.name}`;
      uvSelect.appendChild(option);
    });
  }
}

/**
 * Render the selected questions count in the span
 * and define the input value, max and min value base on the questions length
 * @param {Array} questions - Array containing the filtered questions
 */
function TestQuestionsOptions(questions) {
  const selectedquestionsCountSpan = document.getElementById(
    "selected-questions-count"
  );
  const desiredQuestionsCountInput = document.getElementById(
    "desired-questions-count"
  );
  selectedquestionsCountSpan.textContent = questions.length;
  desiredQuestionsCountInput.value = questions.length;
  desiredQuestionsCountInput.max = questions.length;
  desiredQuestionsCountInput.min = questions.length > 0 ? 1 : 0;
}

/**
 * Sets up synchronization between parent and child checkboxes within accordion components.
 *
 * This function ensures that when a child checkbox within an accordion body is checked or unchecked,
 * the corresponding parent checkbox in the accordion button reflects the change. Conversely, when a
 * parent checkbox is toggled, all child checkboxes within the same accordion item are updated to match
 * the parent's state.
 */
function setupAccordionCheckboxSync() {
  // Sync children to parent
  document.querySelectorAll(".subject-body").forEach((body) => {
    const container = body.closest(".border");
    const parentCheckbox = container.querySelector(
      '.subject-header input[type="checkbox"]'
    );
    const childCheckboxes = body.querySelectorAll('input[type="checkbox"]');

    childCheckboxes.forEach((child) => {
      child.addEventListener("change", () => {
        const anyChecked = Array.from(childCheckboxes).some((cb) => cb.checked);
        parentCheckbox.checked = anyChecked;
      });
    });
  });

  // Sync parent to children
  document
    .querySelectorAll('.subject-header input[type="checkbox"]')
    .forEach((parent) => {
      parent.addEventListener("change", function () {
        const container = this.closest(".border");
        const childCheckboxes = container.querySelectorAll(
          '.subject-body input[type="checkbox"]'
        );
        childCheckboxes.forEach((cb) => {
          cb.checked = this.checked;
        });
      });
    });
}
/**
 * Displays all elements with the class 'test-options' by removing the 'd-none' class.
 * This function selects all elements with the class 'test-options' and iterates over them,
 * removing the 'd-none' class to make them visible.
 */
function showTestOptions() {
  document.querySelectorAll(".test-options").forEach((el) => {
    el.classList.remove("d-none");
  });
}

/**
 * Hides all elements with the class 'test-options' by adding the 'd-none' class.
 */
function hideTestOptions() {
  document.querySelectorAll(".test-options").forEach((el) => {
    el.classList.add("d-none");
  });
}

/**
 * Displays a question and its answer options on the UI.
 *
 * This function updates the DOM elements to show the current question
 * and its possible answers based on the provided index. It also updates
 * the question progression display.
 *
 * @param {Array} questions - An array of question objects, each containing
 *                            an 'id', 'question', and 'options'.
 * @param {number} index - The index of the current question to display.
 */
function showQuestion(questions, index) {
  const questionIDSpan = document.getElementById("question-id");
  const questionContainer = document.getElementById("question-container");
  const answerOptionsContainer = document.getElementById(
    "answer-options-container"
  );

  const explanationTabBtn = document.getElementById("explanation-btn");
  const explanationContainer = document.getElementById("explanation-container");

  if (questions[index]) {
    const questionDict = questions[index];
    // display the question id too
    questionIDSpan.textContent = `N°: ${questionDict.id}`;

    // display the explanation if given or hide the tab btn
    if (questionDict.explanation) {
      explanationContainer.innerHTML = questionDict.explanation;
      explanationTabBtn.classList.remove("d-none");
    } else {
      explanationContainer.innerHTML = "";
      explanationTabBtn.classList.add("d-none");
    }

    // clean previous elements
    questionContainer.innerHTML = "";
    answerOptionsContainer.innerHTML = "";

    questionContainer.innerHTML = questionDict.question;
    questionDict.options.forEach((option, i) => {
      const answerOptionDiv = document.createElement("div");
      answerOptionDiv.className = "answer row d-flex align-items-center";
      answerOptionDiv.setAttribute("data-option-index", JSON.stringify(i));
      answerOptionDiv.innerHTML = `<div class="col-1 fw-bold fs-3">${String.fromCharCode(
        65 + i
      )}.</div>
       <div class="col-11">${option.text}</div>`;
      answerOptionsContainer.appendChild(answerOptionDiv);
    });
    // show the question progression
    showQuestionCountProgression(questions, index);
  }
}

/**
 * Updates the question count display with the current question index and total number of questions.
 *
 * @param {Array} questions - The array of questions.
 * @param {number} index - The current question index.
 */
function showQuestionCountProgression(questions, index) {
  const questionCountDiv = document.getElementById("question-count");
  const indexSpan = questionCountDiv?.querySelector("#index");
  const totalSpan = questionCountDiv?.querySelector("#total");

  indexSpan.textContent = index + 1;
  totalSpan.textContent = questions.length;
}

/**
 * Renders a navigation container with buttons for each question, supporting pagination.
 *
 * This function clears the existing content of the element with the class
 * "question-grid" and populates it with navigation buttons for the current page.
 * Each button corresponds to a question and is labeled with its index (starting from 1).
 * Pagination controls are added to navigate between pages.
 *
 * @param {Array} questions - An array of questions to generate navigation buttons for.
 * @param {number} currentPage - The current page number (starting from 1).
 * @param {number} questionsPerPage - The number of questions to display per page.
 */
function renderNavigationContainer(
  questions,
  currentPage = 1,
  questionsPerPage = 100
) {
  const questionGrid = document.getElementsByClassName("question-grid")[0];
  questionGrid.innerHTML = "";

  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);

  // Render navigation buttons for the current page
  for (let i = startIndex; i < endIndex; i++) {
    const navBtn = document.createElement("a");
    navBtn.className = "btn question-nav";
    navBtn.setAttribute("data-question-index", i);
    navBtn.textContent = i + 1;
    questionGrid.appendChild(navBtn);
  }

  // Render pagination controls
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const prevPageItem = document.createElement("li");
  prevPageItem.className = "page-item" + (currentPage === 1 ? " disabled" : "");
  const prevPageLink = document.createElement("a");
  prevPageLink.className = "page-link";
  prevPageLink.href = "#";
  prevPageLink.setAttribute("aria-label", "Previous");
  prevPageLink.innerHTML = "<span aria-hidden='true'>&laquo;</span>";
  prevPageLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      renderNavigationContainer(questions, currentPage - 1, questionsPerPage);
    }
  };
  prevPageItem.appendChild(prevPageLink);
  paginationContainer.appendChild(prevPageItem);

  for (let page = 1; page <= totalPages; page++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item" + (page === currentPage ? " active" : "");
    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.textContent = page;
    pageLink.onclick = (e) => {
      e.preventDefault();
      renderNavigationContainer(questions, page, questionsPerPage);
    };
    pageItem.appendChild(pageLink);
    paginationContainer.appendChild(pageItem);
  }

  const nextPageItem = document.createElement("li");
  nextPageItem.className =
    "page-item" + (currentPage === totalPages ? " disabled" : "");
  const nextPageLink = document.createElement("a");
  nextPageLink.className = "page-link";
  nextPageLink.href = "#";
  nextPageLink.setAttribute("aria-label", "Next");
  nextPageLink.innerHTML = "<span aria-hidden='true'>&raquo;</span>";
  nextPageLink.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      renderNavigationContainer(questions, currentPage + 1, questionsPerPage);
    }
  };
  nextPageItem.appendChild(nextPageLink);
  paginationContainer.appendChild(nextPageItem);
}


/**
 * Renders a series of question and answer cards within the specified container.
 * Each card displays the question text, the correct answer, and, if applicable,
 * the user's incorrect answer. Cards are styled based on the correctness of the
 * user's answer and are clickable to open a modal for detailed view.
 *
 * @param {Object} test - test dict containing questions and userAnswers
 * 
 */
function renderQACards(test) {
  const questions =  test.questions;
  const userAnswers = test.userAnswers;

  const QADict = buildAnswerDict(questions, userAnswers);

  const answersCardsContainer = document.getElementById(
    "answers-cards-container"
  );
  answersCardsContainer.innerHTML = "";

  questions.forEach((question, idx) => {
    const [userAnswerIndex, correctIndex] = QADict[idx];

    const questionCardHTML = `<div class="answer-card ${
      userAnswerIndex !== correctIndex ? "incorrect" : "correct"
    } p-3 mb-3" 
           data-index="${idx}" data-bs-toggle="modal" data-bs-target="#questionModal">
        <h6>Question N° <span class="question-id">${question.id}</span></h6>
        <p class="mt-1">
          ${question.question}
        </p>
        <div>
          <input
            type="checkbox"
            class="me-2 form-check-input correct"
            checked
          />
          <span>${question.options[correctIndex].text}</span>
        </div>
        ${
          userAnswerIndex !== correctIndex
            ? `<div>
              <input
                type="checkbox"
                class="me-2 form-check-input incorrect"
                checked
              />
              <span>${question.options[userAnswerIndex].text}</span>
            </div>`
            : ""
        }`;
    answersCardsContainer.insertAdjacentHTML("beforeend", questionCardHTML);

    document.querySelectorAll(".answer-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const index = parseInt(card.getAttribute("data-index"));
        showQAmodal(index, questions, userAnswers);
      });
    });
  });
}


/**
 * Builds HTML for modal tabs displaying a question and its options, with an optional explanation tab.
 *
 * @param {Object} question - The question object containing details for rendering.
 * @returns {string} The HTML string for the modal tabs and content.
 */
function buildModalTabs(question) {
  const hasExplanation = !!question.explanation;
  let navTabs = `
    <ul class="nav nav-tabs" id="questionTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="question-tab" data-bs-toggle="tab" data-bs-target="#question" type="button" role="tab" aria-controls="question" aria-selected="true">
          <span class="iconify mr-2" data-icon="zondicons:question"></span>
          Question
        </button>
      </li>
      ${
        hasExplanation
          ? `
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="explanation-tab" data-bs-toggle="tab" data-bs-target="#explanation" type="button" role="tab" aria-controls="explanation" aria-selected="false">
          <span class="iconify mr-2" data-icon="ion:bulb"></span>
          Explanation
        </button>
      </li>
      `
          : ""
      }
    </ul>
  `;

  let tabContent = `
    <div class="tab-content border border-top-0 p-3" id="questionTabContent">
      <div class="tab-pane fade show active" id="question" role="tabpanel" aria-labelledby="question-tab">
        <p>
          ${question.question}
        </p>
        ${question.options
          .map((option, i) => {
            let classes = "answer";
            if (question.correctIndex === i) classes += " correct";
            if (
              question.userAnswerIndex !== question.correctIndex &&
              question.userAnswerIndex === i
            )
              classes += " incorrect";
            return `<div class= "answer row d-flex align-items-center ${classes}">
                  <div class="col-1 fw-bold fs-3">${String.fromCharCode(
                    65 + i
                  )}.</div>
                <div class="col-11">${option.text}</div>
              </div>`;
          })
          .join("")}
      </div>
      ${
        hasExplanation
          ? `
      <div class="tab-pane fade" id="explanation" role="tabpanel" aria-labelledby="explanation-tab">
        <p>
          ${question.explanation}
        </p>
      </div>
      `
          : ""
      }
    </div>
  `;
  return navTabs + tabContent;
}


/**
 * Displays a modal with the question and answer details for a given question index.
 *
 * This function retrieves the user's answer and the correct answer for the specified
 * question index, attaches these indices to the question object, and updates the modal
 * content with the question and its options. It also sets the modal title to reflect
 * the question number.
 *
 * @param {number} questionIndex - The index of the question to display in the modal.
 * @param {Array} questions - An array of question objects, each containing options and other details.
 * @param {Array} userAnswers - An array of user-selected answer indices corresponding to each question.
 */
function showQAmodal(questionIndex, questions, userAnswers) {
  const QADict = buildAnswerDict(questions, userAnswers);
  const question = questions[questionIndex];
  const [userAnswerIndex, correctIndex] = QADict[questionIndex];

  // Attach indices for use in buildModalTabs
  question.userAnswerIndex = userAnswerIndex;
  question.correctIndex = correctIndex;

  const modalBody = document.getElementById("modalQuestionBody");
  modalBody.innerHTML = buildModalTabs(question);

  const modalTitle = document.getElementById("questionModalLabel");
  modalTitle.textContent = `Question N° ${question.id}`;
}

export {
  renderSubjectAccordion,
  TestQuestionsOptions,
  fillUVsOptions,
  showTestOptions,
  hideTestOptions,
  showQuestion,
  renderNavigationContainer,
  renderQACards,
};
