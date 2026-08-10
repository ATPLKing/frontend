import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import HistoricTable from "../components/historic/HistoricTable";
import AppSnackbar from "../components/common/AppSnackbar";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {
  createTest,
  deleteTest,
  loadSavedTests,
  saveTest,
  setCurrentTestId,
} from "../utils/test";
import type { Test } from "../utils/types";

type ConfirmAction = "delete" | "retest";

export default function HistoricPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tests, setTests] = useState<Record<string, Test>>(() => loadSavedTests());
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmState, setConfirmState] = useState<{
    action: ConfirmAction;
    test: Test;
  } | null>(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [snackbar, setSnackbar] = useState("");

  const testsArray = useMemo(() => Object.values(tests), [tests]);
  const filtered = useMemo(
    () =>
      testsArray.filter((test) =>
        `${test.bankName ?? ""} ${test.subject ?? test.uv ?? ""}`
          .toLowerCase()
          .includes(filter.trim().toLowerCase())
      ),
    [testsArray, filter]
  );
  const displayed = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  function answeredCount(test: Test): number {
    return test.userAnswers.filter(
      (answer) => answer !== undefined && answer !== null
    ).length;
  }

  function handleShowResult(test: Test) {
    if (answeredCount(test) !== test.questions.length) {
      setAlertMsg(t("historic.resultError"));
      return;
    }
    setCurrentTestId(test.id);
    navigate("/result");
  }

  function handleOpenTest(test: Test) {
    setCurrentTestId(test.id);
    navigate("/quiz");
  }

  function confirmAction() {
    if (!confirmState) return;
    if (confirmState.action === "delete") {
      deleteTest(confirmState.test);
      setTests(loadSavedTests());
      setConfirmState(null);
      setSnackbar(t("historic.deleted"));
    } else {
      const newTest = createTest(confirmState.test.params);
      saveTest(newTest);
      setCurrentTestId(newTest.id);
      navigate("/quiz");
    }
  }

  function handleFilterChange(value: string) {
    setFilter(value);
    setPage(0);
  }

  function handleRowsPerPageChange(value: number) {
    setRowsPerPage(value);
    setPage(0);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h5" align="center" sx={{ mt: 2 }}>
        {t("historic.title")}
      </Typography>

      <HistoricTable
        displayed={displayed}
        total={filtered.length}
        filter={filter}
        page={page}
        rowsPerPage={rowsPerPage}
        onFilterChange={handleFilterChange}
        onPageChange={setPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRetest={(test) => setConfirmState({ action: "retest", test })}
        onOpen={handleOpenTest}
        onResult={handleShowResult}
        onDelete={(test) => setConfirmState({ action: "delete", test })}
      />

      <ConfirmDialog
        open={confirmState !== null}
        title={
          confirmState?.action === "delete"
            ? t("historic.deleteTitle")
            : t("historic.retestTitle")
        }
        message={
          confirmState?.action === "delete"
            ? t("historic.deleteMessage")
            : t("historic.retestMessage")
        }
        onClose={() => setConfirmState(null)}
        onConfirm={confirmAction}
      />

      <AppSnackbar
        open={Boolean(snackbar)}
        message={snackbar}
        onClose={() => setSnackbar("")}
      />

      <AppSnackbar
        open={Boolean(alertMsg)}
        message={alertMsg}
        severity="warning"
        autoHideDuration={4000}
        position="top"
        onClose={() => setAlertMsg("")}
      />
    </Container>
  );
}
