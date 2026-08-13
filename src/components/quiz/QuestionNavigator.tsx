import { Box, Button, Pagination, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAnswerIndices } from "../../utils/answer";
import {
  flagButtonOrder,
  flagColors,
  FLAG_NONE,
  FLAG_RED,
  FLAG_YELLOW,
} from "../../utils/flag";
import type { Question } from "../../utils/types";

interface NavStyle {
  color?: string;
  bgcolor?: string;
}

interface QuestionNavigatorProps {
  questions: Question[];
  userAnswers: (number | null)[];
  flags: number[];
  displayIndices: number[];
  currentIndex: number;
  totalPages: number;
  page: number;
  flagFilter: number[];
  allAnswered: boolean;
  hideAnswers: boolean;
  onPageChange: (value: number) => void;
  onGoTo: (index: number) => void;
  onToggleFlagFilter: (value: number) => void;
  onPause: () => void;
  onEnd: () => void;
}

export default function QuestionNavigator({
  questions,
  userAnswers,
  flags,
  displayIndices,
  currentIndex,
  totalPages,
  page,
  flagFilter,
  allAnswered,
  hideAnswers,
  onPageChange,
  onGoTo,
  onToggleFlagFilter,
  onPause,
  onEnd,
}: QuestionNavigatorProps) {
  const { t } = useTranslation();

  function navStyle(index: number): NavStyle {
    const answer = userAnswers[index];
    if (answer === undefined || answer === null) return {};
    if (hideAnswers) {
      return { color: "#ffffff", bgcolor: "#0474C4" };
    }
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
          variant={allAnswered ? "contained" : "outlined"}
          color={allAnswered ? "success" : "error"}
          sx={{ mb: 2 }}
          onClick={onEnd}
        >
          {t("quiz.finish")}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {t("quiz.flags")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 2,
          }}
        >
          <Button
            size="small"
            variant={flagFilter.length === 0 ? "contained" : "outlined"}
            onClick={() => onToggleFlagFilter(FLAG_NONE)}
            sx={{ minWidth: 0, px: 1 }}
          >
            {t("quiz.filterAll")}
          </Button>
          {flagButtonOrder.map((value) => {
            const active = flagFilter.includes(value);
            return (
              <Button
                key={value}
                size="small"
                title={
                  value === FLAG_RED
                    ? t("quiz.flagRed")
                    : value === FLAG_YELLOW
                      ? t("quiz.flagYellow")
                      : t("quiz.flagGreen")
                }
                onClick={() => onToggleFlagFilter(value)}
                sx={{
                  minWidth: 32,
                  width: 32,
                  height: 32,
                  p: 0,
                  borderRadius: "50%",
                  bgcolor: active ? flagColors[value] : "transparent",
                  border: 2,
                  borderColor: flagColors[value],
                  "&:hover": {
                    bgcolor: active
                      ? flagColors[value]
                      : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              />
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gap: 1,
          }}
        >
          {displayIndices.map((index) => {
            const style = navStyle(index);
            const flag = flags[index] ?? FLAG_NONE;
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
                  border: 1,
                  borderColor: "text.secondary",
                  borderTopWidth: 3,
                  borderTopColor: flag
                    ? flagColors[flag]
                    : "text.secondary",
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
        {displayIndices.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}>
            {t("quiz.filterEmpty")}
          </Box>
        )}

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
