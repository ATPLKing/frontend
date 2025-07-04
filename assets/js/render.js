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
    const subjectId = `${subject.code}`;

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
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#${subjectId}"
          >
            <input class="form-check-input me-2" id="${subject.code}" type="checkbox" checked />
            ${subject.code} ${subject.name}
            <span class="ms-auto badge bg-secondary">${subject.total}</span>
          </button>
        </h2>
        <div
          id="${subjectId}"
          class="accordion-collapse collapse"
          data-bs-parent="#subjectAccordion"
        >
          <div class="accordion-body ps-5">
            ${subtopicsHtml}
          </div>
        </div>
      </div>`;

    accordion.insertAdjacentHTML("beforeend", itemHtml);
  });
  setupAccordionCheckboxSync();
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
  document.querySelectorAll(".accordion-body").forEach((body) => {
    const item = body.closest(".accordion-item");
    const parentCheckbox = item.querySelector(
      '.accordion-button input[type="checkbox"]'
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
    .querySelectorAll('.accordion-button input[type="checkbox"]')
    .forEach((parent) => {
      parent.addEventListener("change", function () {
        const item = this.closest(".accordion-item");
        const childCheckboxes = item.querySelectorAll(
          '.accordion-body input[type="checkbox"]'
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

export { renderSubjectAccordion, TestQuestionsOptions, fillUVsOptions, showTestOptions, hideTestOptions };
