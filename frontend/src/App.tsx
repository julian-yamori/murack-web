import { Container } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { AppBar } from "./navigation/AppBar.tsx";
import { NavigationStateProvider } from "./navigation/navigation_state.tsx";
import { NavigationView } from "./navigation/NavigationView.tsx";
import { useEffect } from "react";

export const App: React.FC = () => {
  // イベント等でエラーが発生したら Toast で表示
  useEffect(() => {
    const errorListener = (event: ErrorEvent) => {
      showErrorByToast(event.error);
    };

    const rejectionListener = (event: PromiseRejectionEvent) => {
      showErrorByToast(event.reason);
    };

    // イベント、useEffect 等の同期エラー用
    self.addEventListener("error", errorListener);

    // Promise 用
    self.addEventListener("unhandledrejection", rejectionListener);

    return () => {
      self.removeEventListener("error", errorListener);
      self.removeEventListener("unhandledrejection", rejectionListener);
    };
  }, []);

  return (
    <NavigationStateProvider>
      <AppBar />
      <Container maxWidth="lg" sx={{ py: 1 }}>
        <NavigationView />
      </Container>
      <ToastContainer />
    </NavigationStateProvider>
  );
};

function showErrorByToast(error: unknown) {
  let message = "予期しないエラーが発生しました";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  toast.error(message);
}
