import { Alert, Snackbar } from "@mui/material";

type SnackbarSeverity = "success" | "warning" | "info" | "error";
type SnackbarPosition = "top" | "bottom";

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity?: SnackbarSeverity;
  autoHideDuration?: number;
  position?: SnackbarPosition;
  onClose: () => void;
}

export default function AppSnackbar({
  open,
  message,
  severity = "success",
  autoHideDuration = 3000,
  position = "bottom",
  onClose,
}: AppSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: position, horizontal: "center" }}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
