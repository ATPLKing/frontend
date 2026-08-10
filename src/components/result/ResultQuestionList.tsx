import { Box, Paper, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import { getAnswerIndices } from "../../utils/answer";
import type { Question } from "../../utils/types";

interface ResultQuestionListProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onSelect: (index: number) => void;
}

export default function ResultQuestionList({
  questions,
  userAnswers,
  onSelect,
}: ResultQuestionListProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "83.33%" } }}>
        {questions.map((question, idx) => {
          const { correctIndex, userIndex } = getAnswerIndices(
            question,
            userAnswers[idx]
          );
          const isCorrect = userIndex === correctIndex;
          return (
            <Paper
              key={question.id}
              variant="outlined"
              onClick={() => onSelect(idx)}
              sx={{
                p: 2,
                mb: 2,
                cursor: "pointer",
                borderLeft: 4,
                borderLeftColor: isCorrect ? "success.main" : "error.main",
                boxShadow: 2,
              }}
            >
              <Typography variant="subtitle1">
                <strong>{t("result.questionNumber", { id: question.id })}</strong>
              </Typography>
              <Box
                sx={{ my: 1 }}
                dangerouslySetInnerHTML={{ __html: question.question }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "success.main",
                }}
              >
                <CheckCircleIcon fontSize="small" />
                <Box
                  dangerouslySetInnerHTML={{
                    __html: question.options[correctIndex].text,
                  }}
                />
              </Box>
              {!isCorrect && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "error.main",
                  }}
                >
                  <CancelIcon fontSize="small" />
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: question.options[userIndex].text,
                    }}
                  />
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
