import { useState } from "react";
import { Box, Button, Paper, Toolbar, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { GroupFilterParams } from "./group_filter_params.ts";
import { TrackListView } from "../track_list/TrackListView.tsx";
import {
  TrackListItem as TrackListItemData,
  useGetTrackList,
} from "../gen/backend_api.ts";
import { useGeneralSortDesc, useGeneralSortType } from "../preferences.ts";
import { TrackSelectionButtons } from "../track_list/track_selection.tsx";
import { SortInput } from "../track_list/SortInput.tsx";
import { LoadingView } from "../common_components/LoadingView.tsx";

/** グループ選択の検索条件に該当する曲リストを表示するページ */
export const GroupTrackListPage: React.FC<{
  filterParams: GroupFilterParams;
}> = ({ filterParams }) => {
  // ソート設定（preferencesから取得・保存）
  const [sortType, setSortType] = useGeneralSortType();
  const [sortDesc, setSortDesc] = useGeneralSortDesc();

  // 楽曲データ取得
  const { artist, album, genre } = filterParams;
  const { data: tracksResponse, error } = useGetTrackList({
    artist: artist ?? undefined,
    album: album ?? undefined,
    genre: genre ?? undefined,
    sort_type: sortType,
    sort_desc: sortDesc,
  });

  const tracks = tracksResponse?.data ?? [];

  // 選択状態管理 (選択モードでなければ undefined)
  const [selectedTrackIds, setSelectedTrackIds] = useState<
    ReadonlySet<number> | undefined
  >();

  const handleAllTracksPropsClick = () => {
    console.log("全曲プロパティクリック");
    // TODO: 全曲プロパティ画面への遷移
  };

  const handleListTrackClick = (track: TrackListItemData) => {
    console.log("楽曲クリック:", track);
    // TODO: 楽曲プロパティ画面への遷移
  };

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">
          エラーが発生しました: {String(error)}
        </Typography>
      </Box>
    );
  }

  if (tracks === undefined) {
    return <LoadingView />;
  }

  return (
    <Paper>
      {/* ツールバー */}
      <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
        <SortInput
          sortType={sortType}
          sortDesc={sortDesc}
          onTypeChange={setSortType}
          onDescChange={setSortDesc}
        />

        <Box sx={{ flexGrow: 1 }} />

        <TrackSelectionButtons
          selectedTrackIds={selectedTrackIds}
          allIds={tracks.map((track) => track.id)}
          setSelectedTrackIds={setSelectedTrackIds}
        />

        {/* 全曲プロパティボタン */}
        <Button
          startIcon={<Settings />}
          onClick={handleAllTracksPropsClick}
          variant="outlined"
          size="small"
          disabled
        >
          全曲プロパティ
        </Button>
      </Toolbar>

      {/* 楽曲リスト */}
      <TrackListView
        tracks={tracks}
        selectedTrackIds={selectedTrackIds}
        onTrackClick={handleListTrackClick}
        setSelectedTrackIds={setSelectedTrackIds}
      />
    </Paper>
  );
};
