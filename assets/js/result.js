import { renderQACards } from "./render.js";
import { getAnswerPercentages, getAnswerScores } from "./utils/answer.js";
import { themeHandler } from "./theme.js";

const questions = JSON.parse(localStorage.getItem("questions"));
const storedAnswers = JSON.parse(localStorage.getItem("userAnswers"));

function initializeApp() {
  themeHandler();
  testResult(questions, storedAnswers);
  renderQACards(questions, storedAnswers);
}

document.addEventListener("DOMContentLoaded", initializeApp);

function testResult(questions, storedAnswers) {
  const bannerDiv = document.getElementsByClassName("result-banner")[0];
  const percentageSpan = document.getElementById("percentage");
  const correctQuestionsCountSpan = document.getElementById(
    "correct-answers-count"
  );
  const totalQuestionsCountSpan = document.getElementById("questions-count");

  const testPercentage = getAnswerPercentages(questions, storedAnswers);
  const testScore = getAnswerScores(questions, storedAnswers);
  const percentage = testPercentage[0];

  const bannerClass = percentage >= 75 ? "succeeded" : "failed";

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
