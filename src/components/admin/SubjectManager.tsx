import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import type { SubjectMetadata } from "../../utils/types";
import { generateID } from "../../utils/helper";

interface SubjectManagerProps {
  subjects: SubjectMetadata[];
  onChange: (subjects: SubjectMetadata[]) => void;
}

export default function SubjectManager({
  subjects,
  onChange,
}: SubjectManagerProps) {
  const { t } = useTranslation();

  function updateSubject(index: number, patch: Partial<SubjectMetadata>) {
    const next = [...subjects];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function updateSubtopic(
    subjectIndex: number,
    subtopicIndex: number,
    patch: Partial<{ code: string; name: string }>
  ) {
    const next = [...subjects];
    const subtopics = [...next[subjectIndex].subtopics];
    subtopics[subtopicIndex] = { ...subtopics[subtopicIndex], ...patch };
    next[subjectIndex] = { ...next[subjectIndex], subtopics };
    onChange(next);
  }

  function addSubject() {
    onChange([...subjects, { code: "", name: "", subtopics: [] }]);
  }

  function removeSubject(index: number) {
    onChange(subjects.filter((_subject, i) => i !== index));
  }

  function addSubtopic(subjectIndex: number) {
    const next = [...subjects];
    next[subjectIndex] = {
      ...next[subjectIndex],
      subtopics: [
        ...next[subjectIndex].subtopics,
        { code: generateID(), name: "" },
      ],
    };
    onChange(next);
  }

  function removeSubtopic(subjectIndex: number, subtopicIndex: number) {
    const next = [...subjects];
    next[subjectIndex] = {
      ...next[subjectIndex],
      subtopics: next[subjectIndex].subtopics.filter(
        (_subtopic, i) => i !== subtopicIndex
      ),
    };
    onChange(next);
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h6">{t("admin.subjects")}</Typography>
        <Button startIcon={<AddIcon />} onClick={addSubject}>
          {t("admin.addSubject")}
        </Button>
      </Box>

      {subjects.map((subject, subjectIndex) => (
        <Box
          key={subjectIndex}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
            <TextField
              size="small"
              label={t("admin.code")}
              value={subject.code}
              onChange={(event) =>
                updateSubject(subjectIndex, { code: event.target.value })
              }
              sx={{ width: 150 }}
            />
            <TextField
              size="small"
              label={t("admin.name")}
              value={subject.name}
              onChange={(event) =>
                updateSubject(subjectIndex, { name: event.target.value })
              }
              sx={{ flex: 1 }}
            />
            <IconButton color="error" onClick={() => removeSubject(subjectIndex)}>
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t("admin.subtopics")}
          </Typography>
          {subject.subtopics.map((subtopic, subtopicIndex) => (
            <Box
              key={subtopicIndex}
              sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
            >
              <TextField
                size="small"
                label={t("admin.code")}
                value={subtopic.code}
                onChange={(event) =>
                  updateSubtopic(subjectIndex, subtopicIndex, {
                    code: event.target.value,
                  })
                }
                sx={{ width: 150 }}
              />
              <TextField
                size="small"
                label={t("admin.name")}
                value={subtopic.name}
                onChange={(event) =>
                  updateSubtopic(subjectIndex, subtopicIndex, {
                    name: event.target.value,
                  })
                }
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => removeSubtopic(subjectIndex, subtopicIndex)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => addSubtopic(subjectIndex)}
          >
            {t("admin.addSubtopic")}
          </Button>
        </Box>
      ))}
    </Paper>
  );
}
