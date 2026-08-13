import { useState } from "react";
import { Box, Button, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NotesIcon from "@mui/icons-material/Notes";
import { useTranslation } from "react-i18next";
import { getAnswerIndices } from "../../utils/answer";
import { findNote, saveNote, deleteNote } from "../../utils/note";
import { getBooleanSetting, SETTING_HIDE_ANSWERS } from "../../utils/settings";
import type { Question } from "../../utils/types";

interface QuestionCardProps {
  question: Question;
  userAnswer: number | null | undefined;
  onAnswer: (optionIndex: number) => void;
  onNoteSaved: (message: string) => void;
}

export default function QuestionCard({
  question,
  userAnswer,
  onAnswer,
  onNoteSaved,
}: QuestionCardProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [noteText, setNoteText] = useState(() => findNote(question.id));
  const [noteSaved, setNoteSaved] = useState(() => findNote(question.id) !== "");

  const answered = userAnswer !== undefined && userAnswer !== null;
  const showCorrect = answered && !getBooleanSetting(SETTING_HIDE_ANSWERS);
  const { correctIndex, userIndex } = getAnswerIndices(question, userAnswer);

  function handleSaveNote() {
    if (noteText.trim()) {
      saveNote(question.id, noteText.trim());
      setNoteSaved(true);
      onNoteSaved(t("quiz.noteSaved"));
    } else {
      deleteNote(question.id);
      setNoteSaved(false);
      onNoteSaved(t("quiz.noteDeleted"));
    }
  }

  return (
    <>
      <Tabs
        value={tab}
        onChange={(_event, value: number) => setTab(value)}
        sx={{ mb: 2 }}
      >
        <Tab
          icon={<QuestionAnswerIcon />}
          iconPosition="start"
          label={t("common.question")}
        />
        <Tab
          icon={<LightbulbIcon />}
          iconPosition="start"
          label={t("common.explanation")}
        />
        <Tab
          icon={<NotesIcon sx={{ color: noteSaved ? "error.main" : "inherit" }} />}
          iconPosition="start"
          label={t("common.note")}
        />
      </Tabs>

      <Paper variant="outlined" sx={{ p: 3, minHeight: 320 }}>
        {tab === 0 && (
          <>
            <Box
              sx={{ mb: 3 }}
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
            {question.options.map((option, i) => {
              let borderColor = "divider";
              let textColor = "text.primary";
              let fontWeight = "normal";
              if (showCorrect) {
                if (i === correctIndex) {
                  borderColor = "success.main";
                  textColor = "success.main";
                  fontWeight = "bold";
                } else if (i === userIndex) {
                  borderColor = "error.main";
                  textColor = "error.main";
                  fontWeight = "bold";
                }
              }
              return (
                <Box
                  key={i}
                  onClick={() => onAnswer(i)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: 2,
                    borderColor,
                    borderRadius: 1,
                    mb: 2,
                    p: 2,
                    color: textColor,
                    fontWeight,
                    bgcolor: "background.default",
                    cursor: answered ? "default" : "pointer",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", flexShrink: 0 }}>
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
            dangerouslySetInnerHTML={{
              __html: question.explanation ?? t("quiz.noExplanation"),
            }}
          />
        )}

        {tab === 2 && (
          <>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder={t("quiz.notePlaceholder")}
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={handleSaveNote}>
                {t("common.save")}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </>
  );
}
