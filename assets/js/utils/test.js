import { generateID } from "./helper.js";
/**
 * Loads saved tests from local storage.
 * @returns {object} The parsed saved tests object, or an empty object if none are found.
 */
export function loadSavedTests() {
    return JSON.parse(localStorage.getItem("savedTests") || "{}");
}


/**
 * Manages persistence of tests in `localStorage` under the "savedTests" key.
 * Provides `loadSavedTests` to retrieve all tests as an object and
 * `saveTest` to save a single test object, keyed by its ID.
 */
export function saveTest(test){
    const savedTests = loadSavedTests();
    savedTests[test.id] = test;
    localStorage.setItem("savedTests", JSON.stringify(savedTests));
}


export function deleteTest(test){
    const savedTests = loadSavedTests()
    delete savedTests[test.id];
    localStorage.setItem("savedTests", JSON.stringify(savedTests));
}


/**
 * Creates a new test object from the given parameters.
 * @param {object} params - The parameters to create the test with.
 * @param {string} params.mode - The mode of the test.
 * @param {string} params.database - The database for the test.
 * @param {Array} params.questions - The questions for the test.
 * @param {object} [params.uvObj] - Optional UV object.
 * @returns {object} The newly created test object.
 */
export function createTest(params) {
    const test = {};

    test.id = generateID();
    test.mode = params.mode;
    test.database = params.database == "H" ? "HELICOPTERE" : "AVION";
    test.uv = params.uvObj ? `${params.uvObj.id} - ${params.uvObj.name}` : '';
    test.createdAt = new Date().toISOString(),
    test.questions = params.questions,
    test.userAnswers = [];
    test.params = params;
    
    return test;
}

/**
 * Starts a test by saving its ID to local storage and redirecting to the quiz page.
 * @param {object} test - The test object, which must have an 'id' property.
 */
export function startTest(test){
    localStorage.setItem("current-test-id", test.id);
    window.location.href = "/quiz";
}


/**
 * Retrieves the current test from local storage.
 * @returns {object} The current test object
 */
export function getCurrentTest() {
    const savedTests = loadSavedTests();
    const testId = localStorage.getItem("current-test-id");
    return savedTests[testId];
}
