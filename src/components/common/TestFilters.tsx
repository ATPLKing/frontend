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
import type { FilterOption } from "../../utils/types";

interface TestFiltersProps {
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

export default function TestFilters({
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
}: TestFiltersProps) {
  const { t } = useTranslation();

  const today = new Date().toISOString().split("T")[0];
  const toBeforeFrom = Boolean(dateFrom && dateTo && dateTo < dateFrom);
  const fromInFuture = Boolean(dateFrom && dateFrom > today);
  const toInFuture = Boolean(dateTo && dateTo > today);

  return (
    <Accordion
      disableGutters
      sx={{ border: 1, borderColor: "divider", borderRadius: 1, my: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{t("filters.filters")}</Typography>
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
              {t("filters.period")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("filters.periodDescription")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label={t("filters.dateFrom")}
              type="date"
              size="small"
              value={dateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
              error={fromInFuture}
              helperText={fromInFuture ? t("filters.futureDate") : undefined}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: today },
              }}
            />
            <TextField
              label={t("filters.dateTo")}
              type="date"
              size="small"
              value={dateTo}
              onChange={(event) => onDateToChange(event.target.value)}
              error={toInFuture || toBeforeFrom}
              helperText={
                toBeforeFrom
                  ? t("filters.toBeforeFrom")
                  : toInFuture
                    ? t("filters.futureDate")
                    : undefined
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: dateFrom || undefined, max: today },
              }}
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
              {t("filters.bank")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("filters.bankDescription")}
            </Typography>
          </Box>
          <TextField
            select
            size="small"
            value={selectedBank}
            onChange={(event) => onBankChange(event.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">{t("filters.all")}</MenuItem>
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
              {t("filters.subject")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("filters.subjectDescription")}
            </Typography>
          </Box>
          <TextField
            select
            size="small"
            value={selectedSubject}
            onChange={(event) => onSubjectChange(event.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">{t("filters.all")}</MenuItem>
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
              {t("filters.reset")}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
