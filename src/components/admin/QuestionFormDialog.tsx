import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import type { Question, SubjectMetadata } from "../../utils/types";
import { generateID } from "../../utils/helper";

interface OptionDraft {
  text: string;
  correct: boolean;
}

interface QuestionFormDialogProps {
  open: boolean;
  question: Question | null;
  subjects: SubjectMetadata[];
  onClose: () => void;
  onSave: (question: Question) => void;
}

export default function QuestionFormDialog({
  open,
  question,
  subjects,
  onClose,
  onSave,
}: QuestionFormDialogProps) {
  const { t } = useTranslation();
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([]);
  const [subtopic, setSubtopic] = useState("");

  useEffect(() => {
    if (open) {
      setQuestionText(question?.question ?? "");
      setExplanation(question?.explanation ?? "");
      setOptions(
        question
          ? question.options.map((option) => ({
              text: option.text,
              correct: option.correct,
            }))
          : [{ text: "", correct: true }]
      );
      setSubtopic(question?.subtopic ?? "");
    }
  }, [open, question]);

  const allSubtopics = subjects.flatMap((subject) =>
    subject.subtopics.map((sub) => ({
      code: sub.code,
      label: `${subject.code} - ${sub.name}`,
    }))
  );
  const correctCount = options.filter((option) => option.correct).length;

  const valid =
    questionText.trim() !== "" &&
    options.length >= 2 &&
    options.every((option) => option.text.trim() !== "") &&
    correctCount === 1 &&
    subtopic !== "";

  function toggleCorrect(index: number) {
    setOptions((prev) =>
      prev.map((option, i) => ({ ...option, correct: i === index }))
    );
  }

  function updateOptionText(index: number, text: string) {
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? { ...option, text } : option))
    );
  }

  function addOption() {
    setOptions((prev) => [...prev, { text: "", correct: false }]);
  }

  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_option, i) => i !== index));
  }

  function handleSave() {
    if (!valid) return;
    onSave({
      id: question?.id ?? generateID(),
      question: questionText.trim(),
      explanation: explanation.trim() || undefined,
      options: options.map((option) => ({
        text: option.text.trim(),
        correct: option.correct,
      })),
      subtopic,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {question ? t("admin.editQuestion") : t("admin.addQuestion")}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label={t("admin.questionText")}
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
          sx={{ mt: 1 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          label={t("admin.explanation")}
          value={explanation}
          onChange={(event) => setExplanation(event.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          select
          label={t("admin.subtopic")}
          value={subtopic}
          onChange={(event) => setSubtopic(event.target.value)}
          sx={{ mt: 2 }}
          disabled={allSubtopics.length === 0}
        >
          {allSubtopics.map((sub) => (
            <MenuItem key={sub.code} value={sub.code}>
              {sub.label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">{t("admin.options")}</Typography>
          {options.map((option, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
            >
              <Checkbox
                checked={option.correct}
                onChange={() => toggleCorrect(index)}
                slotProps={{ input: { "aria-label": t("admin.correct") } }}
              />
              <TextField
                fullWidth
                size="small"
                label={`${t("admin.optionText")} ${index + 1}`}
                value={option.text}
                onChange={(event) => updateOptionText(index, event.target.value)}
              />
              <IconButton
                color="error"
                onClick={() => removeOption(index)}
                disabled={options.length <= 2}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={addOption}
            sx={{ mt: 1 }}
          >
            {t("admin.addOption")}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button onClick={handleSave} variant="contained" disabled={!valid}>
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
