import React from "react";
import { Box } from "@mui/material";
import { useNavigationState } from "./navigation_state.tsx";
import { NavBreadcrumbs } from "./NavBreadcrumbs.tsx";

export const NavigationView: React.FC = () => {
  const navigationState = useNavigationState();

  const currentPage = navigationState.pageStack.at(-1);

  // ページが未選択ならひとまず空
  if (currentPage === undefined) {
    return null;
  }

  return (
    <Box component="main">
      <NavBreadcrumbs />

      <currentPage.render />
    </Box>
  );
};
