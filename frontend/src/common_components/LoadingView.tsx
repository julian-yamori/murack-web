import { Box, CircularProgress, Typography } from "@mui/material";

/** データの読み込み中に表示するコンポーネント */
export const LoadingView: React.FC = () => {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 1 }}>
        読み込み中...
      </Typography>
    </Box>
  );
};
