import React from "react";
import { useNavigationState } from "./navigation_state.tsx";

export const NavigationView: React.FC = () => {
  const navigationState = useNavigationState();

  const currentPage = navigationState.pageStack.at(-1);

  // ページが未選択ならひとまず空
  if (currentPage === undefined) {
    return null;
  }

  return <currentPage.render />;
};
