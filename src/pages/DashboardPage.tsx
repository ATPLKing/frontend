import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PercentIcon from "@mui/icons-material/Percent";
import TimerIcon from "@mui/icons-material/Timer";
import { useTranslation } from "react-i18next";
import { loadSavedTests } from "../utils/test";
import { getNumberSetting, MIN_SUCCESS_PERCENTAGE } from "../utils/settings";
import { formatSeconds } from "../utils/time";
import ScoreChart from "../components/dashboard/ScoreChart";
import DashboardFilters from "../components/dashboard/DashboardFilters";

const MAX_CHART_POINTS = 20;

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: "0.85rem", lineHeight: 1.3 }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const allTests = useMemo(() => Object.values(loadSavedTests()), []);

  const bankOptions = useMemo(() => {
    const map = new Map<string, string>();
    allTests.forEach((test) => {
      const value = test.bankId || test.database;
      if (!value || map.has(value)) return;
      map.set(value, test.bankName || test.database || value);
    });
    return [...map.entries()].map(([value, name]) => ({ value, name }));
  }, [allTests]);

  const subjectOptions = useMemo(() => {
    const set = new Set<string>();
    allTests
      .filter((test) => !selectedBank || test.bankId === selectedBank)
      .forEach((test) => {
        const value = test.subject || test.uv;
        if (value) set.add(value);
      });
    return [...set].map((value) => ({ value, name: value }));
  }, [allTests, selectedBank]);

  const stats = useMemo(() => {
    const fromTime = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTime = dateTo ? new Date(dateTo + "T23:59:59.999").getTime() : null;

    const filtered = allTests.filter((test) => {
      const time = new Date(test.createdAt).getTime();
      if (fromTime !== null && time < fromTime) return false;
      if (toTime !== null && time > toTime) return false;
      if (selectedBank && test.bankId !== selectedBank) return false;
      if (selectedSubject && test.subject !== selectedSubject) return false;
      return true;
    });

    const finished = filtered.filter((test) => test.score !== undefined);
    const finishedCount = finished.length;

    const average = finishedCount
      ? Math.round(
          finished.reduce((sum, test) => sum + (test.score ?? 0), 0) /
            finishedCount
        )
      : 0;

    const best = finishedCount
      ? Math.max(...finished.map((test) => test.score ?? 0))
      : 0;

    const passed = finished.filter(
      (test) =>
        (test.score ?? 0) >=
        (test.params.minSuccessScore ??
          getNumberSetting(MIN_SUCCESS_PERCENTAGE, 75))
    ).length;
    const passRate = finishedCount
      ? Math.round((passed / finishedCount) * 100)
      : 0;

    const timeSpent = filtered.reduce(
      (sum, test) => sum + (test.timeElapsed ?? 0),
      0
    );

    const sorted = [...finished].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const chartData = sorted.slice(-MAX_CHART_POINTS).map((test, index) => ({
      label: String(index + 1),
      score: test.score ?? 0,
      bankName: test.bankName || test.database || "",
      subject: test.subject || test.uv || "",
      date: test.createdAt,
      time: formatSeconds(test.timeElapsed ?? 0),
    }));

    return {
      totalTests: filtered.length,
      average,
      best,
      passRate,
      timeSpent,
      chartData,
      filteredCount: finished.length,
      threshold: getNumberSetting(MIN_SUCCESS_PERCENTAGE, 75),
    };
  }, [allTests, dateFrom, dateTo, selectedBank, selectedSubject]);

  const filtersActive =
    dateFrom !== "" || dateTo !== "" || selectedBank !== "" || selectedSubject !== "";

  if (allTests.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ pt: 6, pb: 5 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3 }}>
          {t("dashboard.title")}
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 5, borderRadius: 3, textAlign: "center" }}
        >
          <Typography color="text.secondary">{t("dashboard.empty")}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 5 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        {t("dashboard.title")}
      </Typography>

      <DashboardFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        bankOptions={bankOptions}
        selectedBank={selectedBank}
        onBankChange={(value) => {
          setSelectedBank(value);
          setSelectedSubject("");
        }}
        subjectOptions={subjectOptions}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        onReset={() => {
          setDateFrom("");
          setDateTo("");
          setSelectedBank("");
          setSelectedSubject("");
        }}
        active={filtersActive}
      />

      {stats.totalTests === 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 5, borderRadius: 3, textAlign: "center" }}
        >
          <Typography color="text.secondary">
            {t("dashboard.noResults")}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<FactCheckIcon sx={{ fontSize: 32 }} />}
              label={t("dashboard.testsTaken")}
              value={String(stats.totalTests)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<TimelineIcon sx={{ fontSize: 32 }} />}
              label={t("dashboard.averageScore")}
              value={`${stats.average}%`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<EmojiEventsIcon sx={{ fontSize: 32 }} />}
              label={t("dashboard.bestScore")}
              value={`${stats.best}%`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<PercentIcon sx={{ fontSize: 32 }} />}
              label={t("dashboard.passRate")}
              value={`${stats.passRate}%`}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <StatCard
              icon={<TimerIcon sx={{ fontSize: 32 }} />}
              label={t("dashboard.timeSpent")}
              value={formatSeconds(stats.timeSpent)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
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
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                {t("dashboard.scoreProgression")}
              </Typography>
              {stats.filteredCount > stats.chartData.length && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t("dashboard.showingLast", {
                    count: stats.chartData.length,
                  })}
                </Typography>
              )}
              {stats.chartData.length > 0 ? (
                <ScoreChart
                  data={stats.chartData}
                  threshold={stats.threshold}
                  passedLabel={t("dashboard.passed")}
                  failedLabel={t("dashboard.failed")}
                  formatTestNumber={(id) => t("dashboard.testNumber", { id })}
                  timeLabel={t("dashboard.timeElapsed")}
                  formatDate={(raw) =>
                    new Date(raw).toLocaleDateString(
                      i18n.language === "fr" ? "fr-FR" : "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )
                  }
                />
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                  {t("dashboard.noData")}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
