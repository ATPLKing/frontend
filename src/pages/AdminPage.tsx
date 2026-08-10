import { useState } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import BankList from "../components/admin/BankList";
import BankEditor from "../components/admin/BankEditor";
import BankFormDialog from "../components/admin/BankFormDialog";
import ConfirmDialog from "../components/common/ConfirmDialog";
import AppSnackbar from "../components/common/AppSnackbar";
import {
  createQuestionBank,
  deleteQuestionBank,
  loadQuestionBanks,
  saveQuestionBank,
} from "../utils/questionBank";
import type { QuestionBank } from "../utils/types";

export default function AdminPage() {
  const { t } = useTranslation();
  const [banks, setBanks] = useState<QuestionBank[]>(() => loadQuestionBanks());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bankDialog, setBankDialog] = useState<QuestionBank | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuestionBank | null>(null);
  const [snackbar, setSnackbar] = useState("");

  const selected = banks.find((bank) => bank.id === selectedId) ?? null;

  function refresh() {
    const next = loadQuestionBanks();
    setBanks(next);
    setSelectedId((prev) =>
      prev && next.some((bank) => bank.id === prev) ? prev : null
    );
  }

  function handleBankSaved(name: string, description: string) {
    if (bankDialog === "new") {
      const bank = createQuestionBank(name, description);
      saveQuestionBank(bank);
      setSnackbar(t("admin.bankCreated"));
    } else if (bankDialog) {
      const updated = { ...bankDialog, name, description };
      saveQuestionBank(updated);
      setSnackbar(t("admin.bankUpdated"));
    }
    setBankDialog(null);
    refresh();
  }

  function handleBankChange(bank: QuestionBank) {
    saveQuestionBank(bank);
    refresh();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteQuestionBank(deleteTarget.id);
    setDeleteTarget(null);
    setSnackbar(t("admin.bankDeleted"));
    refresh();
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 3, pb: 5 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        {t("admin.title")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: 340 }, flexShrink: 0 }}>
          <BankList
            banks={banks}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNew={() => setBankDialog("new")}
            onEdit={(bank) => setBankDialog(bank)}
            onDelete={(bank) => setDeleteTarget(bank)}
          />
        </Box>

        <Box sx={{ flex: "1 1 0%", minWidth: 0 }}>
          {selected ? (
            <BankEditor bank={selected} onSave={handleBankChange} />
          ) : (
            <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                {t("admin.selectBank")}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      <BankFormDialog
        open={bankDialog !== null}
        initial={
          bankDialog !== null && bankDialog !== "new"
            ? { name: bankDialog.name, description: bankDialog.description }
            : null
        }
        onClose={() => setBankDialog(null)}
        onSave={handleBankSaved}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={t("admin.deleteBankTitle")}
        message={t("admin.deleteBankMessage", {
          name: deleteTarget?.name ?? "",
        })}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <AppSnackbar
        open={Boolean(snackbar)}
        message={snackbar}
        onClose={() => setSnackbar("")}
      />
    </Container>
  );
}
