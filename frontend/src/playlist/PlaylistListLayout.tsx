import { Alert, Box, CircularProgress, List, Typography } from "@mui/material";
import {
  PlaylistDetails,
  PlaylistListItem as PlaylistListItemData,
} from "../gen/backend_api.ts";
import { PlaylistListItem } from "./PlaylistListItem.tsx";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { ChildListPage } from "./ChildListPage.tsx";
import { PlaylistTracksPage } from "./PlaylistTracksPage.tsx";

/** プレイリスト一覧画面の共通画面レイアウト */
export const PlaylistListLayout: React.FC<{
  listData: PlaylistListItemData[] | undefined;

  /** 親プレイリスト (最上位プレイリストを表示する場合は undefined) */
  parentPlaylist: PlaylistDetails | undefined;

  error: unknown;
}> = ({ listData, error }) => {
  const pushPage = usePushPage();

  const handleItemClick = (item: PlaylistListItemData) => {
    if (item.playlist_type === "Folder") {
      // フォルダなら、そのフォルダのプレイリスト一覧画面へ
      pushPage({
        render: () => <ChildListPage parentId={item.id} />,
        navigationMenuKey: undefined,
        breadCrumb: item.name,
      });
    } else {
      // それ以外なら、このプレイリストの曲一覧画面へ

      pushPage({
        render: () => <PlaylistTracksPage playlistId={item.id} />,
        navigationMenuKey: undefined,
        breadCrumb: item.name,
      });
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        データの読み込みに失敗しました
      </Alert>
    );
  }

  if (listData === undefined) {
    return (
      <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (listData.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
        データがありません
      </Typography>
    );
  }

  return (
    <List>
      {listData.map((item: PlaylistListItemData) => (
        <PlaylistListItem
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </List>
  );
};
