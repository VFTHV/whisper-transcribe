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
import InstructionsAccordion from "./InstructionsAccordion";
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
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(135deg, #FF3334, #E02A2B)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Whisper Transcribe
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Record your voice and get instant transcription
        </Typography>
      </Box>

      <Box>
        <InstructionsAccordion
          expanded={expanded === "instructions"}
          onChange={handleChange("instructions")}
        />

        <Accordion
          expanded={expanded === "settings"}
          onChange={handleChange("settings")}
          elevation={0}
          disableGutters
          square
          sx={{
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "primary.main",
            ...(expanded !== "instructions" && {
              borderTop: "1px solid",
              borderTopColor: "primary.main",
            }),
            borderTopLeftRadius:
              expanded === "instructions" || expanded === "settings" ? 0 : 2,
            borderTopRightRadius:
              expanded === "instructions" || expanded === "settings" ? 0 : 2,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
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
    </Box>
  );
};

export default Settings;
