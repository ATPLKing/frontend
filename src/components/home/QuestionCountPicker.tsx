import { Box, Button, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface QuestionCountPickerProps {
  desiredCount: number;
  total: number;
  onChange: (value: number) => void;
  onStart: () => void;
}

export default function QuestionCountPicker({
  desiredCount,
  total,
  onChange,
  onStart,
}: QuestionCountPickerProps) {
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography>{t("home.contains")}</Typography>
        <TextField
          type="number"
          size="small"
          value={desiredCount}
          onChange={(event) => onChange(Number(event.target.value))}
          slotProps={{ htmlInput: { min: 1, max: total } }}
          sx={{ width: 80 }}
        />
        <Typography>{t("home.questionsOn")}</Typography>
        <Typography component="span" sx={{ color: "error.main", fontWeight: "bold" }}>
          {total}
        </Typography>
        <Typography>{t("home.questions")}</Typography>
      </Box>

      <Box sx={{ mt: 3, maxWidth: 400, mx: "auto" }}>
        <Button fullWidth variant="contained" size="large" onClick={onStart}>
          {t("home.startTest")}
        </Button>
      </Box>
    </>
  );
}
