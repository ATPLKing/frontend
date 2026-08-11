import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TimerIcon from "@mui/icons-material/Timer";
import { useTranslation } from "react-i18next";
import { formatSeconds } from "../../utils/time";
import {
  flagButtonOrder,
  flagColors,
  FLAG_RED,
  FLAG_YELLOW,
} from "../../utils/flag";

interface QuestionNavbarProps {
  currentIndex: number;
  total: number;
  timeElapsed: number;
  questionId: string;
  flag: number;
  onSetFlag: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function QuestionNavbar({
  currentIndex,
  total,
  timeElapsed,
  questionId,
  flag,
  onSetFlag,
  onPrev,
  onNext,
}: QuestionNavbarProps) {
  const { t } = useTranslation();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <IconButton aria-label={t("quiz.prevQuestion")} onClick={onPrev}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography>
        {currentIndex + 1} / {total}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TimerIcon sx={{ mr: 0.5, fontSize: 20 }} />
        <Typography>{formatSeconds(timeElapsed)}</Typography>
      </Box>
      <Chip label={t("quiz.questionNumber", { id: questionId })} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {flagButtonOrder.map((value) => {
          const active = flag === value;
          return (
            <IconButton
              key={value}
              size="small"
              title={
                value === FLAG_RED
                  ? t("quiz.flagRed")
                  : value === FLAG_YELLOW
                    ? t("quiz.flagYellow")
                    : t("quiz.flagGreen")
              }
              onClick={() => onSetFlag(value)}
              sx={{ p: 0.5 }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor: active ? flagColors[value] : "transparent",
                  border: 2,
                  borderColor: flagColors[value],
                }}
              />
            </IconButton>
          );
        })}
      </Box>
      <IconButton aria-label={t("quiz.nextQuestion")} onClick={onNext}>
        <ChevronRightIcon />
      </IconButton>
    </Paper>
  );
}
