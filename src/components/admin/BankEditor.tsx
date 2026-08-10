import { Box, Typography } from "@mui/material";
import type { QuestionBank } from "../../utils/types";
import SubjectManager from "./SubjectManager";
import QuestionManager from "./QuestionManager";

interface BankEditorProps {
  bank: QuestionBank;
  onSave: (bank: QuestionBank) => void;
}

export default function BankEditor({ bank, onSave }: BankEditorProps) {
  return (
    <Box>
      <Typography variant="h5">{bank.name}</Typography>
      {bank.description && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {bank.description}
        </Typography>
      )}

      <SubjectManager
        subjects={bank.subjects}
        onChange={(subjects) => onSave({ ...bank, subjects })}
      />

      <QuestionManager
        questions={bank.questions}
        subjects={bank.subjects}
        onChange={(questions) => onSave({ ...bank, questions })}
      />
    </Box>
  );
}
