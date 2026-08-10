import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import type { Question, SubjectMetadata } from "../../utils/types";
import QuestionFormDialog from "./QuestionFormDialog";

interface QuestionManagerProps {
  questions: Question[];
  subjects: SubjectMetadata[];
  onChange: (questions: Question[]) => void;
}

export default function QuestionManager({
  questions,
  subjects,
  onChange,
}: QuestionManagerProps) {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function subtopicLabel(code: string): string {
    for (const subject of subjects) {
      const subtopic = subject.subtopics.find((sub) => sub.code === code);
      if (subtopic) return `${subject.code} - ${subtopic.name}`;
    }
    return code;
  }

  function handleSave(question: Question) {
    if (editingIndex === null || editingIndex < 0) {
      onChange([...questions, question]);
    } else {
      const next = [...questions];
      next[editingIndex] = question;
      onChange(next);
    }
    setEditingIndex(null);
  }

  function handleDelete(index: number) {
    onChange(questions.filter((_question, i) => i !== index));
  }

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
        <Typography variant="h6">{t("admin.questions")}</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setEditingIndex(-1)}>
          {t("admin.addQuestion")}
        </Button>
      </Box>

      {questions.length === 0 ? (
        <Typography color="text.secondary">{t("admin.noQuestions")}</Typography>
      ) : (
        questions.map((question, index) => (
          <Box
            key={question.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              p: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
            <Chip size="small" label={subtopicLabel(question.subtopic)} />
            <IconButton size="small" onClick={() => setEditingIndex(index)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))
      )}

      <QuestionFormDialog
        open={editingIndex !== null}
        question={
          editingIndex !== null && editingIndex >= 0
            ? questions[editingIndex]
            : null
        }
        subjects={subjects}
        onClose={() => setEditingIndex(null)}
        onSave={handleSave}
      />
    </Paper>
  );
}
