import { Box, Typography } from "@mui/material";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";
import { GroupFilterParams } from "./group_filter_params.ts";

/** グループ選択の検索条件に該当する曲リストを表示するページ */
export const GroupTrackListPage: React.FC<{
  filterParams: GroupFilterParams;
}> = ({ filterParams }) => {
  // TODO 曲のリストを読み込む

  const { artist, album, genre } = filterParams;

  // TODO: 画面機能の本体は `frontend/src/track_list/` に作り、他の検索条件での曲リスト画面と共通化する
  return (
    <Box component="main">
      <NavBreadcrumbs />

      {/* 仮で、ここまで選択した値を表示 */}
      <Typography variant="body1">
        ジャンル : {genre}
      </Typography>
      <Typography variant="body1">
        アーティスト : {artist}
      </Typography>
      <Typography variant="body1">
        アルバム : {album}
      </Typography>
    </Box>
  );
};
