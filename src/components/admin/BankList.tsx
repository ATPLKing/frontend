import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import type { QuestionBank } from "../../utils/types";

interface BankListProps {
  banks: QuestionBank[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onEdit: (bank: QuestionBank) => void;
  onDelete: (bank: QuestionBank) => void;
}

export default function BankList({
  banks,
  selectedId,
  onSelect,
  onNew,
  onEdit,
  onDelete,
}: BankListProps) {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h6">{t("admin.banks")}</Typography>
        <Button startIcon={<AddIcon />} onClick={onNew}>
          {t("admin.newBank")}
        </Button>
      </Box>

      {banks.length === 0 ? (
        <Typography color="text.secondary">{t("admin.noBanks")}</Typography>
      ) : (
        <List disablePadding>
          {banks.map((bank) => (
            <ListItemButton
              key={bank.id}
              selected={bank.id === selectedId}
              onClick={() => onSelect(bank.id)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemText
                primary={bank.name}
                secondary={t("admin.questionCount", {
                  count: bank.questions.length,
                })}
                slotProps={{ primary: { sx: { fontWeight: "bold" } } }}
              />
              <IconButton
                size="small"
                aria-label={t("common.edit")}
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(bank);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label={t("common.delete")}
                color="error"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(bank);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      )}
    </Paper>
  );
}
