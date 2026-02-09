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
        <Accordion
          expanded={expanded === "instructions"}
          onChange={handleChange("instructions")}
          elevation={0}
          disableGutters
          square
          sx={{
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "primary.main",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            borderBottomLeftRadius: expanded === "instructions" ? 0 : 2,
            borderBottomRightRadius: expanded === "instructions" ? 0 : 2,
            borderBottom: expanded === "instructions" ? "none" : "1px solid",
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              "& .MuiAccordionSummary-content": { my: 1 },
            }}
          >
            <Typography fontWeight={500}>
              Instructions & Shortcuts
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              pt: 0,
              borderTop: "1px solid",
              borderColor: "action.selected",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                bgcolor: "action.hover",
                p: 1.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "action.selected",
                mb: 2,
              }}
            >
              Press{" "}
              <Box
                component="kbd"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                }}
              >
                Ctrl+K
              </Box>{" "}
              to start/stop recording (works even when tab is not active). Press{" "}
              <Box
                component="kbd"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                }}
              >
                Space
              </Box>{" "}
              to pause/resume recording. Press{" "}
              <Box
                component="kbd"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                }}
              >
                Escape
              </Box>{" "}
              to cancel recording.
            </Typography>
            <Box sx={{ textAlign: "left" }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                How to use:
              </Typography>
              <Box component="ol" sx={{ pl: 2.5, m: 0, "& li": { mb: 0.5 } }}>
                <li>Click &quot;Start Recording&quot; to begin recording your voice</li>
                <li>Speak clearly into your microphone</li>
                <li>Click &quot;Stop Recording&quot; when you&apos;re done</li>
                <li>Wait for the transcription to appear below</li>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

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
            borderTop: expanded === "instructions" ? "none" : "1px solid",
            borderTopLeftRadius: expanded === "instructions" || expanded === "settings" ? 0 : 2,
            borderTopRightRadius: expanded === "instructions" || expanded === "settings" ? 0 : 2,
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
    </Box>
  );
};

export default Settings;
