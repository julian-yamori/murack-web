import { Container } from "@mui/material";
import { AppBar } from "./navigation/AppBar.tsx";
import { NavigationStateProvider } from "./navigation/navigation_state.tsx";
import { NavigationView } from "./navigation/NavigationView.tsx";

export const App: React.FC = () => {
  return (
    <NavigationStateProvider>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <NavigationView />
      </Container>
    </NavigationStateProvider>
  );
};
