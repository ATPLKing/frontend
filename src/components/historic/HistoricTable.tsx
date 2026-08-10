import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { formatDateOnly, formatSeconds } from "../../utils/time";
import type { Test } from "../../utils/types";

interface HistoricTableProps {
  displayed: Test[];
  total: number;
  filter: string;
  page: number;
  rowsPerPage: number;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
  onRetest: (test: Test) => void;
  onOpen: (test: Test) => void;
  onResult: (test: Test) => void;
  onDelete: (test: Test) => void;
}

export default function HistoricTable({
  displayed,
  total,
  filter,
  page,
  rowsPerPage,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
  onRetest,
  onOpen,
  onResult,
  onDelete,
}: HistoricTableProps) {
  const { t } = useTranslation();

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 4,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        boxShadow: 3,
        px: 3,
        py: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder={t("historic.search")}
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
          sx={{ width: 240 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("historic.bank")}</TableCell>
              <TableCell align="center">{t("historic.subject")}</TableCell>
              <TableCell align="center">{t("historic.questionCount")}</TableCell>
              <TableCell align="center">{t("historic.score")}</TableCell>
              <TableCell align="center">{t("historic.dateDuration")}</TableCell>
              <TableCell align="center">{t("historic.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayed.map((test) => (
              <TableRow key={test.id} hover>
                <TableCell>{test.bankName ?? test.database ?? "-"}</TableCell>
                <TableCell align="center">{test.subject ?? test.uv ?? "-"}</TableCell>
                <TableCell align="center">{test.questions.length}</TableCell>
                <TableCell align="center">
                  {test.score ? `${test.score}%` : "-"}
                </TableCell>
                <TableCell align="center">
                  {formatDateOnly(test.saveAt ?? test.createdAt)} |{" "}
                  {formatSeconds(test.timeElapsed ?? 0)}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <IconButton
                      size="small"
                      title={t("historic.retest")}
                      onClick={() => onRetest(test)}
                      sx={{
                        bgcolor: "#980ca7",
                        color: "#fff",
                        "&:hover": { bgcolor: "#540654" },
                      }}
                    >
                      <ReplayIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title={t("historic.openTest")}
                      onClick={() => onOpen(test)}
                      sx={{
                        bgcolor: "#0ca797",
                        color: "#fff",
                        "&:hover": { bgcolor: "#06544c" },
                      }}
                    >
                      <ListAltIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title={t("historic.viewResult")}
                      onClick={() => onResult(test)}
                      sx={{
                        bgcolor: "#59b368",
                        color: "#fff",
                        "&:hover": { bgcolor: "#11b62c" },
                      }}
                    >
                      <DashboardIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title={t("historic.delete")}
                      onClick={() => onDelete(test)}
                      sx={{
                        bgcolor: "#ff5c47",
                        color: "#fff",
                        "&:hover": { bgcolor: "#ff1e00" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {displayed.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("historic.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_event, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          onRowsPerPageChange(Number.parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage={t("historic.rowsPerPage")}
      />
    </Paper>
  );
}
