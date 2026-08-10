import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TestActionButtonsProps {
  onTest: () => void;
  onExam: () => void;
}

export default function TestActionButtons({
  onTest,
  onExam,
}: TestActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
        mb: 3,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Button fullWidth variant="contained" size="large" onClick={onTest}>
        {t("home.test")}
      </Button>
      <Button fullWidth variant="contained" size="large" onClick={onExam}>
        {t("home.exam")}
      </Button>
    </Box>
  );
}
