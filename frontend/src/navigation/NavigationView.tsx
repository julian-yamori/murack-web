import React from "react";
import { GroupListPage } from "../group_list/GroupListPage.tsx";
import { TestTagGroupPage } from "../test_tag_group/TestTagGroupPage.tsx";
import { useNavigationState } from "./navigation_state.tsx";

/** ナビゲーションの状態に応じたページを表示するコンポーネント */
export const NavigationView: React.FC = () => {
  const navigationState = useNavigationState();

  const currentPage = navigationState.pageStack.at(-1);

  // ページが未選択ならひとまず空
  if (currentPage === undefined) {
    return null;
  }

  switch (currentPage.type) {
    case "group-list":
      return <GroupListPage command={currentPage} />;

    case "test-tag-group":
      return <TestTagGroupPage />;
  }
};
