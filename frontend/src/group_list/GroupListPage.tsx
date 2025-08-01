import { Box, Button, Typography } from "@mui/material";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";

/** グループリストページを開くコマンド */
export type PageCommandGroupList = Readonly<{
  type: "group-list";

  /** ページスタックの深さ (ナビゲーションシステムの動作確認用) */
  depth: number;
}>;

/**
 * グループ選択画面
 *
 * 「アーティスト」とか「ジャンル」とかを選択する画面。
 * ひとまず旧アプリからの名残で、これらの選択項目のことを「グループ」と呼ぶ。
 */
export const GroupListPage: React.FC<{ command: PageCommandGroupList }> = (
  { command },
) => {
  const pushPage = usePushPage();

  const handleDepthClick = () => {
    // depth を一つ増やしたページへ遷移する
    pushPage({ ...command, depth: command.depth + 1 });
  };

  return (
    <Box component="main">
      <NavBreadcrumbs />

      <Typography>ナビゲーションテスト : {command.depth}</Typography>

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
