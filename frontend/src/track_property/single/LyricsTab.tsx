import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Box, TextField } from "@mui/material";
import { SingleTrackProperty } from "../../gen/backend_api.ts";

interface LyricsTabProps {
  register: UseFormRegister<SingleTrackProperty>;
}

export const LyricsTab: React.FC<LyricsTabProps> = ({ register }) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TextField
        {...register("lyrics")}
        label="歌詞"
        multiline
        fullWidth
        variant="outlined"
        sx={{
          flex: 1,
          "& .MuiInputBase-root": {
            height: "100%",
          },
          "& .MuiInputBase-input": {
            height: "100% !important",
          },
        }}
        InputProps={{
          style: {
            fontFamily: "monospace",
            fontSize: "14px",
            lineHeight: 1.6,
          },
        }}
        placeholder="歌詞を入力してください..."
      />
    </Box>
  );
};
