import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  flagButtonOrder,
  flagColors,
  FLAG_RED,
  FLAG_YELLOW,
} from "../../utils/flag";

interface FlagFilterProps {
  value: number[];
  onChange: (value: number[]) => void;
  label?: string;
}

export default function FlagFilter({ value, onChange, label }: FlagFilterProps) {
  const { t } = useTranslation();

  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 0.5, display: "block" }}
        >
          {label}
        </Typography>
      )}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button
          size="small"
          variant={value.length === 0 ? "contained" : "outlined"}
          onClick={() => onChange([])}
          sx={{ minWidth: 0, px: 1 }}
        >
          {t("quiz.filterAll")}
        </Button>
        {flagButtonOrder.map((flagValue) => {
          const active = value.includes(flagValue);
          return (
            <Button
              key={flagValue}
              size="small"
              title={
                flagValue === FLAG_RED
                  ? t("quiz.flagRed")
                  : flagValue === FLAG_YELLOW
                    ? t("quiz.flagYellow")
                    : t("quiz.flagGreen")
              }
              onClick={() =>
                onChange(
                  active
                    ? value.filter((v) => v !== flagValue)
                    : [...value, flagValue]
                )
              }
              sx={{
                minWidth: 32,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: "50%",
                bgcolor: active ? flagColors[flagValue] : "transparent",
                border: 2,
                borderColor: flagColors[flagValue],
                "&:hover": {
                  bgcolor: active
                    ? flagColors[flagValue]
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
