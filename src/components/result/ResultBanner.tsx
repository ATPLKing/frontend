import { Box, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { formatSeconds } from "../../utils/time";

const PASS_THRESHOLD = 75;

interface ResultBannerProps {
  title: string;
  mode: string;
  timeElapsed: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
  onBack: () => void;
}

export default function ResultBanner({
  title,
  mode,
  timeElapsed,
  correctCount,
  totalCount,
  percentage,
  onBack,
}: ResultBannerProps) {
  const { t } = useTranslation();
  const succeeded = percentage >= PASS_THRESHOLD;
  const bannerColor = succeeded ? "#59b368" : "#ff5236";
  const arcColor = succeeded ? "#3e8e41" : "#ff745e";

  return (
    <Paper
      sx={{
        bgcolor: bannerColor,
        color: "#ffffff",
        p: 4,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit" aria-label={t("result.back")} onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          {t("result.title")}
        </Typography>
        <Typography variant="h6" sx={{ my: 1 }}>
          {title} | {mode}
        </Typography>
        <Typography>
          {t("result.timeSpent", { time: formatSeconds(timeElapsed), correct: correctCount, total: totalCount })}
        </Typography>
      </Box>

      <Box sx={{ position: "relative", display: "inline-flex", color: "#ffffff" }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={150}
          thickness={9}
          sx={{
            color: arcColor,
            "& .MuiCircularProgress-track": { color: "#ffffff" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {percentage}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
