import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {
  PageCommand,
  useNavigationState,
  useSetNavigationState,
} from "./navigation_state.tsx";

/** ナビゲーションシステムのパンくずリスト */
export const NavBreadcrumbs: React.FC = () => {
  const { pageStack } = useNavigationState();
  const setNavigationState = useSetNavigationState();

  function handleLinkClick(stackIndex: number) {
    // クリックされたページへ戻る
    setNavigationState((old) => ({
      ...old,
      pageStack: old.pageStack.slice(0, stackIndex + 1),
    }));
  }

  const lastIndex = pageStack.length - 1;

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pageStack.map((pageCommand, stackIndex) =>
        stackIndex !== lastIndex
          ? (
            // 末尾以外のリンクボタン
            <Link
              key={stackIndex}
              underline="hover"
              color="inherit"
              component="button"
              onClick={() => handleLinkClick(stackIndex)}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                font: "inherit",
              }}
            >
              {pageCommandToText(pageCommand)}
            </Link>
          )
          : (
            // 末尾の強調表示
            <Typography key={stackIndex} sx={{ color: "text.primary" }}>
              {pageCommandToText(pageCommand)}
            </Typography>
          )
      )}
    </Breadcrumbs>
  );
};

function pageCommandToText(command: PageCommand): string {
  switch (command.type) {
    case "group-list":
      return command.depth.toString();

    case "test-tag-group":
      return "タググループ一覧";
  }
}
