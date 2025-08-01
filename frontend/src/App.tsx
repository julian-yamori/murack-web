import { Container } from "@mui/material";
import { TestTagGroupPage } from "./test_tag_group/TestTagGroupPage.tsx";
import { AppBar } from "./navigation/AppBar.tsx";

export const App: React.FC = () => {
  return (
    <>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TestTagGroupPage />
      </Container>
    </>
  );
};
