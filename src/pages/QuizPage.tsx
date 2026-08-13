import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import QuestionNavbar from "../components/quiz/QuestionNavbar";
import QuestionCard from "../components/quiz/QuestionCard";
import QuestionNavigator from "../components/quiz/QuestionNavigator";
import TestDialogs from "../components/quiz/TestDialogs";
import { getCurrentTest, saveTest } from "../utils/test";
import { FLAG_NONE, getQuestionFlag, setQuestionFlag } from "../utils/flag";
import { getAnswerIndices } from "../utils/answer";
import { getBooleanSetting, SETTING_AUTO_ADVANCE, SETTING_HIDE_ANSWERS } from "../utils/settings";
import type { Question, Test } from "../utils/types";

const QUESTIONS_PER_PAGE = 100;

export default function QuizPage() {
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(() => getCurrentTest());
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    () => getCurrentTest()?.userAnswers ?? []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(
    () => getCurrentTest()?.timeElapsed ?? 0
  );
  const [flags, setFlags] = useState<number[]>(() => {
    const loaded = getCurrentTest();
    return (loaded?.questions ?? []).map((question) =>
      getQuestionFlag(question.id)
    );
  });
  const [flagFilter, setFlagFilter] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [incompleteOpen, setIncompleteOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [noteSnackbar, setNoteSnackbar] = useState("");

  const timeRef = useRef(timeElapsed);
  const testRef = useRef(test);

  useEffect(() => {
    timeRef.current = timeElapsed;
  }, [timeElapsed]);

  useEffect(() => {
    testRef.current = test;
  }, [test]);

  const questions = useMemo<Question[]>(() => test?.questions ?? [], [test]);
  const question = questions[currentIndex];

  const visibleIndices = useMemo(() => {
    if (flagFilter.length === 0) {
      return questions.map((_unused, i) => i);
    }
    return questions
      .map((_unused, i) => i)
      .filter((i) => flagFilter.includes(flags[i] ?? FLAG_NONE));
  }, [questions, flags, flagFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(visibleIndices.length / QUESTIONS_PER_PAGE)
  );
  const pageStart = (page - 1) * QUESTIONS_PER_PAGE;
  const pageEnd = Math.min(
    pageStart + QUESTIONS_PER_PAGE,
    visibleIndices.length
  );
  const displayIndices = visibleIndices.slice(pageStart, pageEnd);

  useEffect(() => {
    if (!test || test.score !== undefined) return;
    const interval = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [test]);

  useEffect(() => {
    if (!test || test.score !== undefined) return;
    const saveInterval = setInterval(() => {
      const current = testRef.current;
      if (current) {
        saveTest({ ...current, timeElapsed: timeRef.current });
      }
    }, 30000);
    return () => clearInterval(saveInterval);
  }, [test]);

  if (!test || !question) {
    return <Navigate to="/" replace />;
  }

  const answeredCount = userAnswers.filter(
    (answer) => answer !== undefined && answer !== null
  ).length;

  function isAnswered(index: number): boolean {
    return userAnswers[index] !== undefined && userAnswers[index] !== null;
  }

  function handleAnswer(optionIndex: number) {
    if (!test || isAnswered(currentIndex)) return;
    const next = [...userAnswers];
    next[currentIndex] = optionIndex;
    setUserAnswers(next);
    const updated = { ...test, userAnswers: next };
    setTest(updated);
    saveTest(updated);
    if (
      getBooleanSetting(SETTING_AUTO_ADVANCE) &&
      currentIndex + 1 < questions.length
    ) {
      const { correctIndex, userIndex } = getAnswerIndices(
        questions[currentIndex],
        optionIndex
      );
      if (userIndex === correctIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  }

  function handleSetFlag(value: number) {
    if (!test) return;
    const question = test.questions[currentIndex];
    const nextFlag = flags[currentIndex] === value ? FLAG_NONE : value;
    const next = [...flags];
    next[currentIndex] = nextFlag;
    setFlags(next);
    setQuestionFlag(question.id, nextFlag);
  }

  function handleToggleFlagFilter(value: number) {
    setFlagFilter((prev) => {
      if (value === FLAG_NONE) return [];
      return prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
    });
    setPage(1);
  }

  function handlePrev() {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function goToQuestion(index: number) {
    setCurrentIndex(index);
    const position = visibleIndices.indexOf(index);
    if (position >= 0) {
      setPage(Math.floor(position / QUESTIONS_PER_PAGE) + 1);
    }
  }

  function handleEndClick() {
    if (answeredCount !== questions.length) {
      setIncompleteOpen(true);
      return;
    }
    setEndOpen(true);
  }

  function confirmEnd() {
    if (!test) return;
    const updated = { ...test, timeElapsed, saveAt: new Date().toISOString() };
    setTest(updated);
    saveTest(updated);
    navigate("/result");
  }

  function confirmPause() {
    if (!test) return;
    const updated = { ...test, timeElapsed, saveAt: new Date().toISOString() };
    saveTest(updated);
    navigate("/historic");
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 3, pb: 5 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ flex: "1 1 0%", minWidth: 0 }}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            {test.bankName ?? test.database ?? ""}
          </Typography>

          <QuestionNavbar
            currentIndex={currentIndex}
            total={questions.length}
            timeElapsed={timeElapsed}
            questionId={question.id}
            flag={flags[currentIndex] ?? FLAG_NONE}
            onSetFlag={handleSetFlag}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          <QuestionCard
            key={question.id}
            question={question}
            userAnswer={userAnswers[currentIndex]}
            onAnswer={handleAnswer}
            onNoteSaved={setNoteSnackbar}
          />
        </Box>

        <QuestionNavigator
          questions={questions}
          userAnswers={userAnswers}
          flags={flags}
          displayIndices={displayIndices}
          currentIndex={currentIndex}
          totalPages={totalPages}
          page={page}
          flagFilter={flagFilter}
          allAnswered={answeredCount === questions.length}
          hideAnswers={getBooleanSetting(SETTING_HIDE_ANSWERS)}
          onPageChange={setPage}
          onGoTo={goToQuestion}
          onToggleFlagFilter={handleToggleFlagFilter}
          onPause={() => setPauseOpen(true)}
          onEnd={handleEndClick}
        />
      </Box>

      <TestDialogs
        remainingCount={questions.length - answeredCount}
        incompleteOpen={incompleteOpen}
        endOpen={endOpen}
        pauseOpen={pauseOpen}
        snackbar={noteSnackbar}
        onCloseIncomplete={() => setIncompleteOpen(false)}
        onCloseEnd={() => setEndOpen(false)}
        onConfirmEnd={confirmEnd}
        onClosePause={() => setPauseOpen(false)}
        onConfirmPause={confirmPause}
        onCloseSnackbar={() => setNoteSnackbar("")}
      />
    </Container>
  );
}
