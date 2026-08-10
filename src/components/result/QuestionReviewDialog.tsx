import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAnswerIndices } from "../../utils/answer";
import type { Question } from "../../utils/types";

interface QuestionReviewDialogProps {
  open: boolean;
  question: Question | null;
  userAnswer: number | null | undefined;
  onClose: () => void;
}

export default function QuestionReviewDialog({
  open,
  question,
  userAnswer,
  onClose,
}: QuestionReviewDialogProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (open) setTab(0);
  }, [open]);

  if (!question) return null;

  const { correctIndex, userIndex } = getAnswerIndices(question, userAnswer);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="question-modal-title"
    >
      <DialogTitle id="question-modal-title">
        {t("result.questionNumber", { id: question.id })}
      </DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={tab}
          onChange={(_event, value: number) => setTab(value)}
          sx={{ mb: 2 }}
        >
          <Tab label={t("common.question")} />
          {question.explanation && <Tab label={t("common.explanation")} />}
        </Tabs>

        {tab === 0 && (
          <>
            <Box
              sx={{ mb: 2 }}
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
            {question.options.map((option, i) => {
              let borderColor = "divider";
              let textColor = "text.primary";
              let fontWeight = "normal";
              if (i === correctIndex) {
                borderColor = "success.main";
                textColor = "success.main";
                fontWeight = "bold";
              } else if (i === userIndex) {
                borderColor = "error.main";
                textColor = "error.main";
                fontWeight = "bold";
              }
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: 2,
                    borderColor,
                    borderRadius: 1,
                    mb: 1.5,
                    p: 1.5,
                    color: textColor,
                    fontWeight,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", flexShrink: 0 }}
                  >
                    {String.fromCharCode(65 + i)}.
                  </Typography>
                  <Box
                    sx={{ flex: 1 }}
                    dangerouslySetInnerHTML={{ __html: option.text }}
                  />
                </Box>
              );
            })}
          </>
        )}

        {tab === 1 && (
          <Box
            dangerouslySetInnerHTML={{ __html: question.explanation ?? "" }}
          />
        )}
      </DialogContent>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button onClick={onClose}>{t("common.close")}</Button>
      </Box>
    </Dialog>
  );
}
