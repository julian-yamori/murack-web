import { Box, Button, Typography } from "@mui/material";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";

/**
 * グループ選択画面
 *
 * 「アーティスト」とか「ジャンル」とかを選択する画面。
 * ひとまず旧アプリからの名残で、これらの選択項目のことを「グループ」と呼ぶ。
 */
export const GroupListPage: React.FC<{
  /** ページスタックの深さ (ナビゲーションシステムの動作確認用) */
  depth: number;
}> = (
  { depth },
) => {
  const pushPage = usePushPage();

  const handleDepthClick = () => {
    // depth を一つ増やしたページへ遷移する
    const nextDepth = depth + 1;

    pushPage({
      render: () => <GroupListPage depth={nextDepth} />,
      navigationMenuKey: "group-list",
      breadCrumb: nextDepth % 2 === 0 ? nextDepth.toString() : undefined,
    });
  };

  return (
    <Box component="main">
      <NavBreadcrumbs />

      <Typography>ナビゲーションテスト : {depth}</Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleDepthClick}
        >
          深く
        </Button>
      </Box>
    </Box>
  );
};
