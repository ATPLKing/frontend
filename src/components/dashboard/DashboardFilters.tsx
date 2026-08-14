import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

export interface FilterOption {
  value: string;
  name: string;
}

interface DashboardFiltersProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  bankOptions: FilterOption[];
  selectedBank: string;
  onBankChange: (value: string) => void;
  subjectOptions: FilterOption[];
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  onReset: () => void;
  active: boolean;
}

export default function DashboardFilters({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  bankOptions,
  selectedBank,
  onBankChange,
  subjectOptions,
  selectedSubject,
  onSubjectChange,
  onReset,
  active,
}: DashboardFiltersProps) {
  const { t } = useTranslation();

  return (
    <Accordion
      disableGutters
      sx={{ border: 1, borderColor: "divider", borderRadius: 1, mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t("dashboard.filters")}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {t("dashboard.period")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.periodDescription")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label={t("dashboard.dateFrom")}
              type="date"
              size="small"
              value={dateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label={t("dashboard.dateTo")}
              type="date"
              size="small"
              value={dateTo}
              onChange={(event) => onDateToChange(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {t("dashboard.bank")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.bankDescription")}
            </Typography>
          </Box>
          <TextField
            select
            size="small"
            value={selectedBank}
            onChange={(event) => onBankChange(event.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">{t("dashboard.all")}</MenuItem>
            {bankOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              {t("dashboard.subject")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("dashboard.subjectDescription")}
            </Typography>
          </Box>
          <TextField
            select
            size="small"
            value={selectedSubject}
            onChange={(event) => onSubjectChange(event.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">{t("dashboard.all")}</MenuItem>
            {subjectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {active && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
            <Button size="small" onClick={onReset}>
              {t("dashboard.reset")}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
