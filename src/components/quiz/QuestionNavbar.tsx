import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TimerIcon from "@mui/icons-material/Timer";
import { useTranslation } from "react-i18next";
import { formatSeconds } from "../../utils/time";

interface QuestionNavbarProps {
  currentIndex: number;
  total: number;
  timeElapsed: number;
  questionId: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function QuestionNavbar({
  currentIndex,
  total,
  timeElapsed,
  questionId,
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
      <IconButton aria-label={t("quiz.nextQuestion")} onClick={onNext}>
        <ChevronRightIcon />
      </IconButton>
    </Paper>
  );
}
