import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import BankSelector from "../components/home/BankSelector";
import TestActionButtons from "../components/home/TestActionButtons";
import QuestionCountPicker from "../components/home/QuestionCountPicker";
import SubjectAccordion from "../components/SubjectAccordion";
import AppSnackbar from "../components/common/AppSnackbar";
import { filterQuestionsBySubtopics } from "../utils/question";
import { countQuestionsPerSubject } from "../utils/stats";
import { shuffleArray } from "../utils/array";
import { createTest, saveTest, setCurrentTestId } from "../utils/test";
import { loadQuestionBanks } from "../utils/questionBank";
import type { QuestionBank } from "../utils/types";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [banks] = useState<QuestionBank[]>(() => loadQuestionBanks());
  const [selectedBankId, setSelectedBankId] = useState("");
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<string>>(
    new Set()
  );
  const [testOptionsVisible, setTestOptionsVisible] = useState(false);
  const [desiredCount, setDesiredCount] = useState(0);
  const [snackbar, setSnackbar] = useState("");
  const [examSnackbar, setExamSnackbar] = useState(false);

  const selectedBank = useMemo(
    () => banks.find((bank) => bank.id === selectedBankId) ?? null,
    [banks, selectedBankId]
  );
  const questions = useMemo(
    () => selectedBank?.questions ?? [],
    [selectedBank]
  );

  const filteredQuestions = useMemo(
    () => filterQuestionsBySubtopics(questions, [...selectedSubtopics]),
    [questions, selectedSubtopics]
  );

  const subjectStats = useMemo(
    () => countQuestionsPerSubject(questions, selectedBank?.subjects ?? []),
    [questions, selectedBank]
  );

  useEffect(() => {
    setDesiredCount(filteredQuestions.length);
  }, [filteredQuestions.length]);

  function handleBankChange(bankId: string) {
    const bank = banks.find((b) => b.id === bankId);
    setSelectedBankId(bankId);
    setSelectedSubtopics(
      new Set(
        bank?.subjects.flatMap((subject) =>
          subject.subtopics.map((subtopic) => subtopic.code)
        ) ?? []
      )
    );
    setTestOptionsVisible(Boolean(bank));
  }

  function handleTestClick() {
    if (!selectedBank) {
      setSnackbar(t("home.selectBankError"));
      return;
    }
    setTestOptionsVisible(true);
  }

  function toggleSubtopic(code: string) {
    setSelectedSubtopics((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  }

  function toggleSubject(codes: string[], checked: boolean) {
    setSelectedSubtopics((prev) => {
      const next = new Set(prev);
      codes.forEach((code) => {
        if (checked) next.add(code);
        else next.delete(code);
      });
      return next;
    });
  }

  function startTest() {
    if (!selectedBank) {
      setSnackbar(t("home.selectBankError"));
      return;
    }
    if (filteredQuestions.length === 0) {
      setSnackbar(t("home.noQuestionsError"));
      return;
    }
    if (desiredCount <= 0 || desiredCount > filteredQuestions.length) {
      setSnackbar(t("home.countError", { count: filteredQuestions.length }));
      return;
    }

    const selectedSubjects = selectedBank.subjects.filter((subject) =>
      subject.subtopics.some((subtopic) => selectedSubtopics.has(subtopic.code))
    );
    const subjectLabel = selectedSubjects
      .map((subject) => subject.name)
      .join(", ");

    const shuffled = shuffleArray([...filteredQuestions]);
    shuffled.forEach((question) => {
      question.options = shuffleArray(question.options);
    });
    const finalQuestions = shuffled.slice(0, desiredCount);

    const test = createTest({
      mode: "TEST",
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      subject: subjectLabel,
      questions: finalQuestions,
    });
    saveTest(test);
    setCurrentTestId(test.id);
    navigate("/quiz");
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Card
        sx={{
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          boxShadow: 3,
          mx: "auto",
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
            {t("home.title")}
          </Typography>

          <BankSelector
            banks={banks}
            value={selectedBankId}
            onChange={handleBankChange}
          />

          <TestActionButtons
            onTest={handleTestClick}
            onExam={() => setExamSnackbar(true)}
          />

          {testOptionsVisible && selectedBank && (
            <>
              <Box
                sx={{ maxWidth: 600, mx: "auto", textAlign: "left", mb: 3 }}
              >
                <SubjectAccordion
                  data={subjectStats}
                  selectedSubtopics={selectedSubtopics}
                  onToggleSubtopic={toggleSubtopic}
                  onToggleSubject={toggleSubject}
                />
              </Box>

              <QuestionCountPicker
                desiredCount={desiredCount}
                total={filteredQuestions.length}
                onChange={setDesiredCount}
                onStart={startTest}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AppSnackbar
        open={Boolean(snackbar)}
        message={snackbar}
        severity="warning"
        autoHideDuration={4000}
        position="top"
        onClose={() => setSnackbar("")}
      />

      <AppSnackbar
        open={examSnackbar}
        message={t("home.examSoon")}
        severity="info"
        autoHideDuration={4000}
        position="top"
        onClose={() => setExamSnackbar(false)}
      />
    </Container>
  );
}
