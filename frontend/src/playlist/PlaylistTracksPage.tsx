import { Box, Button, Paper, Toolbar } from "@mui/material";
import {
  getGetPlaylistDetailsKey,
  getGetPlaylistTracksKey,
  SortTypeWithPlaylist,
  TrackListItem as TrackListItemData,
  updatePlaylistSortDesc,
  updatePlaylistSortType,
  useGetPlaylistDetails,
  useGetPlaylistTracks,
} from "../gen/backend_api.ts";
import { TrackListView } from "../track_list/TrackListView.tsx";
import { TrackSelectionButtons } from "../track_list/track_selection.tsx";
import { SortInputWithPlaylist } from "../track_list/SortInput.tsx";
import { Settings } from "@mui/icons-material";
import { useState } from "react";
import { mutate } from "swr";
import {
  ScreenLockBackdrop,
  useScreenLock,
} from "../common_components/screen_lock.tsx";
import { LoadingView } from "../common_components/LoadingView.tsx";
import { LoadingErrorAlert } from "../common_components/LoadingErrorAlert.tsx";

/** プレイリストの曲リストを表示するページ */
export const PlaylistTracksPage: React.FC<{ playlistId: number }> = (
  { playlistId },
) => {
  const { isLocked, lockScreen } = useScreenLock();

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

  // ソート種別の変更イベント
  const handleSortTypeChange = (sortType: SortTypeWithPlaylist) => {
    lockScreen(async () => {
      await updatePlaylistSortType(playlistId, sortType);

      await Promise.all([
        mutate(getGetPlaylistDetailsKey(playlistId)),
        mutate(getGetPlaylistTracksKey(playlistId)),
      ]);
    });
  };

  // ソート降順フラグの変更イベント
  const handleSortDescChange = (sort_desc: boolean) => {
    lockScreen(async () => {
      await updatePlaylistSortDesc(playlistId, { sort_desc });

      await Promise.all([
        mutate(getGetPlaylistDetailsKey(playlistId)),
        mutate(getGetPlaylistTracksKey(playlistId)),
      ]);
    });
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
    return <LoadingErrorAlert error={error} />;
  }
  if (tracks === undefined || playlist === undefined) {
    return <LoadingView />;
  }

  return (
    <Paper>
      <ScreenLockBackdrop isLocked={isLocked} />

      {/* ツールバー */}
      <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
        <SortInputWithPlaylist
          sortType={playlist.sort_type}
          sortDesc={playlist.sort_desc}
          enablePlaylist={playlist.playlist_type === "Normal"}
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
  );
};
