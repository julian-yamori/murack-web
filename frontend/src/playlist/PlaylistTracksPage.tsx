import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  SortTypeWithPlaylist,
  TrackListItem as TrackListItemData,
  useGetPlaylistDetails,
  useGetPlaylistTracks,
} from "../gen/backend_api.ts";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";
import { TrackListView } from "../track_list/TrackListView.tsx";
import { TrackSelectionButtons } from "../track_list/track_selection.tsx";
import { SortInputWithPlaylist } from "../track_list/SortInput.tsx";
import { Settings } from "@mui/icons-material";
import { useState } from "react";

/** プレイリストの曲リストを表示するページ */
export const PlaylistTracksPage: React.FC<{ playlistId: number }> = (
  { playlistId },
) => {
  const { data: plistResponse, error: plistError } = useGetPlaylistDetails(
    playlistId,
  );
  const { data: tracksResponse, error: tracksError } = useGetPlaylistTracks(
    playlistId,
  );

  const tracks = tracksResponse?.data;
  const playlist = plistResponse?.data;

  // 選択状態管理 (選択モードでなければ undefined)
  const [selectedTrackIds, setSelectedTrackIds] = useState<
    ReadonlySet<number> | undefined
  >();

  const handleSortTypeChange = (sortType: SortTypeWithPlaylist) => {
    // TODO
    console.log(`sort type changed: ${sortType}`);
  };

  const handleSortDescChange = (sortDesc: boolean) => {
    // TODO
    console.log(`sort desc changed: ${sortDesc}`);
  };

  const handleAllTracksPropsClick = () => {
    console.log("全曲プロパティクリック");
    // TODO: 全曲プロパティ画面への遷移
  };

  const handleListTrackClick = (track: TrackListItemData) => {
    console.log("楽曲クリック:", track);
    // TODO: 楽曲プロパティ画面への遷移
  };

  const error = plistError ?? tracksError;
  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">
          エラーが発生しました: {String(error)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="main">
      <NavBreadcrumbs />
      {tracks === undefined || playlist === undefined
        ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              読み込み中...
            </Typography>
          </Box>
        )
        : (
          <Paper>
            {/* ツールバー */}
            <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
              <SortInputWithPlaylist
                sortType={playlist.sort_type}
                sortDesc={playlist.sort_desc}
                onTypeChange={handleSortTypeChange}
                onDescChange={handleSortDescChange}
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
        )}
    </Box>
  );
};
