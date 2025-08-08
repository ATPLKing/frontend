import { renderQACards } from "./render.js";
import { getAnswerPercentages, getAnswerScores } from "./utils/answer.js";
import { displayTime } from "./utils/time.js";
import { themeHandler } from "./theme.js";
import { getCurrentTest, saveTest } from "./utils/test.js";


const test = getCurrentTest();

function initializeApp() {
  themeHandler();
  testResult(test);
  renderQACards(test);
}

document.addEventListener("DOMContentLoaded", initializeApp);

function testResult(test) {
  let questions = test.questions;
  let userAnswers = test.userAnswers;

  // test informations display
  const bannerDiv = document.getElementsByClassName("result-banner")[0];
  const uvSpan = document.getElementById("uv");
  const dbSpan = document.getElementById("db");
  const modeSpan = document.getElementById("mode");
  const timeSpentSpan = document.getElementById("time-spent");
  const percentageSpan = document.getElementById("percentage");
  const correctQuestionsCountSpan = document.getElementById(
    "correct-answers-count"
  );
  const totalQuestionsCountSpan = document.getElementById("questions-count");

  const testPercentage = getAnswerPercentages(questions, userAnswers);
  const testScore = getAnswerScores(questions, userAnswers);
  const percentage = testPercentage[0];

  // add the score to the test historic use
  test.score = percentage;
  saveTest(test);

  const bannerClass = percentage >= 75 ? "succeeded" : "failed";

  uvSpan.innerText = test.uv;
  dbSpan.innerText = test.database;
  modeSpan.innerText = test.mode;
  displayTime(timeSpentSpan, test.timeElapsed);

  percentageSpan.innerText = testPercentage[0];
  bannerDiv.classList.add(bannerClass);
  correctQuestionsCountSpan.innerText = testScore[0];
  totalQuestionsCountSpan.innerText = testScore[1];

  const color = percentage >= 75 ? "#3e8e41" : "#ff745e";
  const ctx = document.getElementById("grade-bar").getContext("2d");
  const data = {
    datasets: [
      {
        data: testPercentage,
        backgroundColor: ["#ffffff", color],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%", // size of center hole
    rotation: -90,
    circumference: 360,
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
    animation: {
      animateRotate: true,
      duration: 1500,
    },
  };

  new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: options,
  });
}
