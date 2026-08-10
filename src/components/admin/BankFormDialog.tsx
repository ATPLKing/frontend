import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface BankFormDialogProps {
  open: boolean;
  initial: { name: string; description: string } | null;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export default function BankFormDialog({
  open,
  initial,
  onClose,
  onSave,
}: BankFormDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
    }
  }, [open, initial]);

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim(), description.trim());
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? t("admin.editBank") : t("admin.newBank")}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={t("admin.bankName")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          fullWidth
          multiline
          rows={2}
          label={t("admin.description")}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name.trim()}
        >
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
