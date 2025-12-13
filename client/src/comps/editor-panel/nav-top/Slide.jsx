import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";

export default function Slide({ selectedFile, onSave, onRun }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        px: 1,
      }}
    >
      {/* Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          flex: 1,
          "& .MuiButtonBase-root": {
            color: "grey",
            borderRadius: "20px",
            ":hover": {
              color: "white",
              transition: "0.3s",
            },
          },
          "& .MuiTab-root": {
            color: "grey",
            "&.Mui-selected": {
              color: "white",
            },
          },
        }}
      >
        {selectedFile && <Tab label={selectedFile} />}
      </Tabs>

      {/* Actions */}
      {selectedFile && <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SaveIcon />}
          onClick={onSave}
        >
          Save
        </Button>

        <Button
          variant="contained"
          size="small"
          startIcon={<PlayArrowIcon />}
          onClick={onRun}
        >
          Run
        </Button>
      </Stack>}
    </Box>
  );
}
