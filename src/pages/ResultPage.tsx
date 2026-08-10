import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import ResultBanner from "../components/result/ResultBanner";
import ResultQuestionList from "../components/result/ResultQuestionList";
import QuestionReviewDialog from "../components/result/QuestionReviewDialog";
import { getAnswerPercentages, getAnswerScores } from "../utils/answer";
import { getCurrentTest, saveTest } from "../utils/test";

export default function ResultPage() {
  const navigate = useNavigate();
  const [test] = useState(() => getCurrentTest());
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const percentage = test
    ? getAnswerPercentages(test.questions, test.userAnswers)[0]
    : 0;
  const [correctCount, totalCount] = test
    ? getAnswerScores(test.questions, test.userAnswers)
    : [0, 0];

  useEffect(() => {
    if (test && test.score !== percentage) {
      saveTest({ ...test, score: percentage });
    }
  }, [test, percentage]);

  if (!test) {
    return <Navigate to="/" replace />;
  }

  const bannerTitle = [
    test.bankName ?? test.database ?? "",
    test.subject ?? test.uv ?? "",
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
      <ResultBanner
        title={bannerTitle}
        mode={test.mode}
        timeElapsed={test.timeElapsed ?? 0}
        correctCount={correctCount}
        totalCount={totalCount}
        percentage={percentage}
        onBack={() => navigate(-1)}
      />

      <ResultQuestionList
        questions={test.questions}
        userAnswers={test.userAnswers}
        onSelect={setModalIndex}
      />

      <QuestionReviewDialog
        open={modalIndex !== null}
        question={
          modalIndex === null ? null : test.questions[modalIndex]
        }
        userAnswer={
          modalIndex === null ? null : test.userAnswers[modalIndex]
        }
        onClose={() => setModalIndex(null)}
      />
    </Container>
  );
}
