import { useState } from "react";
import { Box, Container, Paper, Switch, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  loadSettings,
  setSetting,
  SETTING_AUTO_ADVANCE,
} from "../utils/settings";
import type { SettingDefinition } from "../utils/settings";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [settingsValues, setSettingsValues] = useState(() => loadSettings());

  const settings: SettingDefinition[] = [
    {
      key: SETTING_AUTO_ADVANCE,
      label: t("settings.autoAdvance"),
      description: t("settings.autoAdvanceDescription"),
    },
  ];

  function handleChange(key: string, value: boolean) {
    setSetting(key, value);
    setSettingsValues({ ...settingsValues, [key]: value });
  }

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        {t("settings.title")}
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("settings.quiz")}
        </Typography>

        {settings.map((setting) => (
          <Box
            key={setting.key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              py: 1,
            }}
          >
            <Box>
              <Typography>{setting.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {setting.description}
              </Typography>
            </Box>
            <Switch
              checked={Boolean(settingsValues[setting.key])}
              onChange={(event) => handleChange(setting.key, event.target.checked)}
            />
          </Box>
        ))}
      </Paper>
    </Container>
  );
}
