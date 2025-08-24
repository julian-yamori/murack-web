import React, { ReactNode } from "react";
import { Alert } from "@mui/material";

export type ErrorBoundaryProps = Readonly<{
  children: ReactNode;
}>;

type ErrorBoundaryState = Readonly<{
  error: unknown;
}>;

export class ErrorBoundary
  extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  public static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error };
  }

  public override render(): ReactNode {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {errorMessage(error)}
        </Alert>
      );
    } else {
      return children;
    }
  }
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    return "予期しないエラーが発生しました";
  }
}
