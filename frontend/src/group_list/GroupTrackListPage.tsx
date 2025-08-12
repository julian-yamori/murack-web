import { Box } from "@mui/material";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";
import { GroupFilterParams } from "./group_filter_params.ts";
import { TrackListView } from "../track_list/TrackListView.tsx";
import { useGetTrackList } from "../gen/backend_api.ts";
import { useGeneralSortDesc, useGeneralSortType } from "../preferences.ts";

/** グループ選択の検索条件に該当する曲リストを表示するページ */
export const GroupTrackListPage: React.FC<{
  filterParams: GroupFilterParams;
}> = ({ filterParams }) => {
  // ソート設定（preferencesから取得・保存）
  const [sortType, setSortType] = useGeneralSortType();
  const [sortDesc, setSortDesc] = useGeneralSortDesc();

  // 楽曲データ取得
  const { artist, album, genre } = filterParams;
  const { data: tracksResponse, error, isLoading } = useGetTrackList({
    artist: artist ?? undefined,
    album: album ?? undefined,
    genre: genre ?? undefined,
    sort_type: sortType,
    sort_desc: sortDesc,
  });

  const tracks = tracksResponse?.data ?? [];

  return (
    <Box component="main">
      <NavBreadcrumbs />

      <TrackListView
        tracks={tracks}
        loading={isLoading}
        error={error ? String(error) : undefined}
        sortType={sortType}
        sortDesc={sortDesc}
        onSortTypeChange={setSortType}
        onSortDescChange={setSortDesc}
      />
    </Box>
  );
};
