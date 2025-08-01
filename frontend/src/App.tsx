import { Box, Container, Typography } from "@mui/material";
import { TestTagGroupPage } from "./test_tag_group/TestTagGroupPage.tsx";

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Murack Web
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          楽曲ライブラリ管理システム
        </Typography>
      </Box>

      <TestTagGroupPage />
    </Container>
  );
}

export default App;
