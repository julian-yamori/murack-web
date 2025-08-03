import React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import {
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
      {pageStack.map((stackItem, stackIndex) => {
        const text = stackItem.breadCrumb;
        if (text !== undefined) {
          return (
            <BreadcrumbItem
              key={stackIndex}
              text={text}
              stackIndex={stackIndex}
              last={stackIndex === lastIndex}
              onLinkClick={handleLinkClick}
            />
          );
        } else {
          return undefined;
        }
      }).filter((elem) => elem !== undefined)}
    </Breadcrumbs>
  );
};

/** パンくずリストのページ毎の要素 */
const BreadcrumbItem: React.FC<
  {
    text: string;
    stackIndex: number;
    last: boolean;
    onLinkClick: (stackIndex: number) => unknown;
  }
> = ({ text, stackIndex, last, onLinkClick }) => {
  if (!last) {
    // 末尾以外のリンクボタン
    return (
      <Link
        underline="hover"
        color="inherit"
        component="button"
        onClick={() => onLinkClick(stackIndex)}
        sx={{
          background: "none",
          border: "none",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        {text}
      </Link>
    );
  } else {
    return (
      // 末尾の強調表示
      <Typography sx={{ color: "text.primary" }}>
        {text}
      </Typography>
    );
  }
};
