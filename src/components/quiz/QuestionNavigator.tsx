import { Box, Button, Pagination, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAnswerIndices } from "../../utils/answer";
import type { Question } from "../../utils/types";

interface NavStyle {
  color?: string;
  bgcolor?: string;
}

interface QuestionNavigatorProps {
  questions: Question[];
  userAnswers: (number | null)[];
  currentIndex: number;
  pageStart: number;
  pageEnd: number;
  totalPages: number;
  page: number;
  onPageChange: (value: number) => void;
  onGoTo: (index: number) => void;
  onPause: () => void;
  onEnd: () => void;
}

export default function QuestionNavigator({
  questions,
  userAnswers,
  currentIndex,
  pageStart,
  pageEnd,
  totalPages,
  page,
  onPageChange,
  onGoTo,
  onPause,
  onEnd,
}: QuestionNavigatorProps) {
  const { t } = useTranslation();

  function navStyle(index: number): NavStyle {
    const answer = userAnswers[index];
    if (answer === undefined || answer === null) return {};
    const { correctIndex, userIndex } = getAnswerIndices(questions[index], answer);
    if (userIndex === correctIndex) {
      return { color: "#ffffff", bgcolor: "#43C361" };
    }
    return { color: "#ffffff", bgcolor: "#C34343" };
  }

  return (
    <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
      <Paper variant="outlined" sx={{ p: 2, position: { md: "sticky" }, top: 16 }}>
        <Button fullWidth variant="contained" sx={{ mb: 1 }} onClick={onPause}>
          {t("common.save")}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          sx={{ mb: 2 }}
          onClick={onEnd}
        >
          {t("quiz.finish")}
        </Button>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gap: 1,
          }}
        >
          {Array.from(
            { length: pageEnd - pageStart },
            (_unused, i) => pageStart + i
          ).map((index) => {
            const style = navStyle(index);
            return (
              <Button
                key={index}
                size="small"
                onClick={() => onGoTo(index)}
                sx={{
                  minWidth: 32,
                  width: 32,
                  height: 32,
                  p: 0,
                  fontWeight: "bold",
                  bgcolor: style.bgcolor ?? undefined,
                  color: style.color ?? undefined,
                  outline: index === currentIndex ? "2px solid" : "none",
                  outlineColor:
                    index === currentIndex ? "primary.main" : "transparent",
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Box>

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_event, value) => onPageChange(value)}
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          />
        )}
      </Paper>
    </Box>
  );
}
