import { Alert } from "@mui/material";

export const LoadingErrorAlert: React.FC<{ error: unknown }> = ({ error }) => {
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {errorMessage(error)}
    </Alert>
  );
};

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    return "予期しないエラーが発生しました";
  }
}
