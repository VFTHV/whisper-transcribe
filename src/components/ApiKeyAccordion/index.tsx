import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ApiKeyInput from "./ApiKeyInput";

type Props = {
  setApiKey: (apiKey: string) => void;
};

const ApiKeyAccordion = ({ setApiKey }: Props) => {
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
          <Typography fontWeight={500}>API Key Settings</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, borderTop: "1px solid", borderColor: "action.selected" }}>
          <ApiKeyInput setApiKey={setApiKey} onSubmitted={() => setExpanded(false)} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ApiKeyAccordion;
