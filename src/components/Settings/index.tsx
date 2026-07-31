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
  TextField,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ApiKeySection from "./ApiKeySection";
import InstructionsAccordion from "./InstructionsAccordion";
import type { TranscriptionModelId } from "./transcriptionModels";
import { useFetchTranscriptionModels } from "./useFetchTranscriptionModels";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { settingsActions } from "../../features/settings/slice/reducers";
import {
  selectModel,
  selectModels,
  selectModelsError,
  selectModelsStatus,
  selectPrompt,
} from "../../features/settings/slice/selectors";

const Settings = () => {
  const dispatch = useAppDispatch();
  const model = useAppSelector(selectModel);
  const models = useAppSelector(selectModels);
  const modelsStatus = useAppSelector(selectModelsStatus);
  const modelsError = useAppSelector(selectModelsError);
  const prompt = useAppSelector(selectPrompt);
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  useFetchTranscriptionModels();

  const selectedModelMetadata = models.find((m) => m.id === model);

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
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
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
            bgcolor: "surfaceContainer.low",
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
                <FormControl
                  fullWidth
                  size="small"
                  sx={{ minWidth: 200 }}
                  disabled={modelsStatus === "loading" || models.length === 0}
                >
                  <InputLabel id="transcription-model-label">
                    Transcription model
                  </InputLabel>
                  <Select
                    labelId="transcription-model-label"
                    value={models.some((m) => m.id === model) ? model : ""}
                    label="Transcription model"
                    onChange={(e) =>
                      dispatch(
                        settingsActions.setModel(
                          e.target.value as TranscriptionModelId
                        )
                      )
                    }
                  >
                    {models.map(({ id, label }) => (
                      <MenuItem key={id} value={id}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography
                  variant="body2"
                  color={modelsError ? "error" : "text.secondary"}
                  sx={{ mt: 0.5 }}
                >
                  {modelsError ||
                    (modelsStatus === "loading"
                      ? "Loading transcription models…"
                      : selectedModelMetadata &&
                        `$${selectedModelMetadata.pricePerMinuteUsd.toFixed(3)}/min · ${selectedModelMetadata.description}`)}
                </Typography>
              </Box>
              <Box>
                <TextField
                  label="Transcription prompt"
                  placeholder="e.g. This transcription is about cooking recipes with terms like sous-vide and mise en place."
                  value={prompt}
                  onChange={(e) =>
                    dispatch(settingsActions.setPrompt(e.target.value))
                  }
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Optional. Guides the model on vocabulary and context. Leave
                  empty to use the default React/TypeScript-focused prompt.
                </Typography>
              </Box>
              <ApiKeySection onSubmitted={() => setExpanded(false)} />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Settings;
