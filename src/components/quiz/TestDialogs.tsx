import { useTranslation } from "react-i18next";
import AppSnackbar from "../common/AppSnackbar";
import ConfirmDialog from "../common/ConfirmDialog";

interface TestDialogsProps {
  remainingCount: number;
  incompleteOpen: boolean;
  endOpen: boolean;
  pauseOpen: boolean;
  snackbar: string;
  onCloseIncomplete: () => void;
  onCloseEnd: () => void;
  onConfirmEnd: () => void;
  onClosePause: () => void;
  onConfirmPause: () => void;
  onCloseSnackbar: () => void;
}

export default function TestDialogs({
  remainingCount,
  incompleteOpen,
  endOpen,
  pauseOpen,
  snackbar,
  onCloseIncomplete,
  onCloseEnd,
  onConfirmEnd,
  onClosePause,
  onConfirmPause,
  onCloseSnackbar,
}: TestDialogsProps) {
  const { t } = useTranslation();

  return (
    <>
      <ConfirmDialog
        open={incompleteOpen}
        onClose={onCloseIncomplete}
        onConfirm={onCloseIncomplete}
        title={t("quiz.incompleteTitle")}
        message={t("quiz.incompleteMessage", { count: remainingCount })}
        confirmLabel="OK"
      />

      <ConfirmDialog
        open={endOpen}
        onClose={onCloseEnd}
        onConfirm={onConfirmEnd}
        title={t("quiz.finishTitle")}
        message={t("quiz.finishMessage")}
      />

      <ConfirmDialog
        open={pauseOpen}
        onClose={onClosePause}
        onConfirm={onConfirmPause}
        title={t("quiz.saveTitle")}
        message={t("quiz.finishMessage")}
      />

      <AppSnackbar
        open={Boolean(snackbar)}
        message={snackbar}
        onClose={onCloseSnackbar}
      />
    </>
  );
}
