import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Chip,
  FormControlLabel,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { SubjectStats } from "../utils/types";

interface SubjectAccordionProps {
  data: SubjectStats[];
  selectedSubtopics: Set<string>;
  onToggleSubtopic: (code: string) => void;
  onToggleSubject: (codes: string[], checked: boolean) => void;
}

export default function SubjectAccordion({
  data,
  selectedSubtopics,
  onToggleSubtopic,
  onToggleSubject,
}: SubjectAccordionProps) {
  return (
    <Box>
      {data.map((subject) => {
        const subjectCodes = subject.subtopics.map((sub) => sub.code);
        const allChecked =
          subjectCodes.length > 0 &&
          subjectCodes.every((code) => selectedSubtopics.has(code));
        const someChecked = subjectCodes.some((code) =>
          selectedSubtopics.has(code)
        );

        return (
          <Accordion
            key={subject.code}
            disableGutters
            sx={{ mb: 1, border: 1, borderColor: "divider", borderRadius: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  pr: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={allChecked}
                      indeterminate={someChecked && !allChecked}
                      onChange={(event) =>
                        onToggleSubject(subjectCodes, event.target.checked)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />
                  }
                  label={`${subject.code} ${subject.name}`}
                  onClick={(event) => event.stopPropagation()}
                />
                <Chip size="small" label={subject.total} />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 4, py: 2 }}>
              {subject.subtopics.map((sub) => (
                <Box
                  key={sub.code}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedSubtopics.has(sub.code)}
                        onChange={() => onToggleSubtopic(sub.code)}
                      />
                    }
                    label={`${sub.code} - ${sub.name}`}
                  />
                  <Chip size="small" label={sub.count} />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
