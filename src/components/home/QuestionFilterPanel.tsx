import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Switch,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import FlagFilter from "../common/FlagFilter";

interface QuestionFilterPanelProps {
  flagFilter: number[];
  onFlagFilterChange: (value: number[]) => void;
  unseenOnly: boolean;
  onUnseenOnlyChange: (value: boolean) => void;
  notesOnly: boolean;
  onNotesOnlyChange: (value: boolean) => void;
}

export default function QuestionFilterPanel({
  flagFilter,
  onFlagFilterChange,
  unseenOnly,
  onUnseenOnlyChange,
  notesOnly,
  onNotesOnlyChange,
}: QuestionFilterPanelProps) {
  const { t } = useTranslation();

  return (
    <Accordion
      disableGutters
      sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t("home.filters")}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>{t("home.flags")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("home.flagsDescription")}
            </Typography>
          </Box>
          <FlagFilter value={flagFilter} onChange={onFlagFilterChange} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {t("home.unseenOnly")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("home.unseenOnlyDescription")}
            </Typography>
          </Box>
          <Switch
            checked={unseenOnly}
            onChange={(event) => onUnseenOnlyChange(event.target.checked)}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {t("home.notesOnly")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("home.notesOnlyDescription")}
            </Typography>
          </Box>
          <Switch
            checked={notesOnly}
            onChange={(event) => onNotesOnlyChange(event.target.checked)}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
