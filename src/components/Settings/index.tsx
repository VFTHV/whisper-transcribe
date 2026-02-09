import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ApiKeySection from "./ApiKeySection";
import {
  TRANSCRIPTION_MODEL_IDS,
  TRANSCRIPTION_MODEL_LABELS,
  TRANSCRIPTION_MODEL_DESCRIPTIONS,
  type TranscriptionModelId,
} from "./transcriptionModels";

type Props = {
  setApiKey: (apiKey: string) => void;
  model: TranscriptionModelId;
  setModel: (model: TranscriptionModelId) => void;
};

const Settings = ({ setApiKey, model, setModel }: Props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box>
      <Accordion
        expanded={expanded}
        onChange={(_, isExp) => setExpanded(isExp)}
        elevation={0}
        sx={{
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            "& .MuiAccordionSummary-content": { my: 1 },
          }}
        >
          <Typography fontWeight={500}>Settings</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            pt: 0,
            borderTop: "1px solid",
            borderColor: "action.selected",
          }}
        >
          <Stack spacing={2}>
            <Box>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="transcription-model-label">
                  Transcription model
                </InputLabel>
                <Select
                  labelId="transcription-model-label"
                  value={model}
                  label="Transcription model"
                  onChange={(e) =>
                    setModel(e.target.value as TranscriptionModelId)
                  }
                >
                  {TRANSCRIPTION_MODEL_IDS.map((id) => (
                    <MenuItem key={id} value={id}>
                      {TRANSCRIPTION_MODEL_LABELS[id]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {TRANSCRIPTION_MODEL_DESCRIPTIONS[model]}
              </Typography>
            </Box>
            <ApiKeySection
              setApiKey={setApiKey}
              onSubmitted={() => setExpanded(false)}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Settings;
