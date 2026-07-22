import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

type Props = {
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

const InstructionsAccordion = ({ expanded, onChange }: Props) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      elevation={0}
      disableGutters
      square
      sx={{
        bgcolor: "surfaceContainer.low",
        border: "1px solid",
        borderColor: "primary.main",
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        borderBottomLeftRadius: expanded ? 0 : 2,
        borderBottomRightRadius: expanded ? 0 : 2,
        borderBottom: expanded ? "none" : "1px solid",
        borderBottomColor: "primary.main",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          "& .MuiAccordionSummary-content": { my: 1 },
        }}
      >
        <Typography fontWeight={500}>Instructions & Shortcuts</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: "1px solid",
          borderColor: "action.selected",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            bgcolor: "surfaceContainer.low",
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
            <li>
              Click &quot;Start Recording&quot; to begin recording your voice
            </li>
            <li>Speak clearly into your microphone</li>
            <li>Click &quot;Stop Recording&quot; when you&apos;re done</li>
            <li>Wait for the transcription to appear below</li>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default InstructionsAccordion;
