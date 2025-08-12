import { Box, CircularProgress, List, Paper, Typography } from "@mui/material";
import { TrackListItem } from "./TrackListItem.tsx";
import { TrackListToolbar } from "./TrackListToolbar.tsx";
import {
  SortType,
  TrackListItem as TrackListItemData,
} from "../gen/backend_api.ts";
import { useState } from "react";

/** 曲リスト画面のメインコンポーネント */
export const TrackListView: React.FC<{
  /** 表示する楽曲のリスト */
  tracks: ReadonlyArray<TrackListItemData>;
  /** データロード中かどうか */
  loading: boolean;
  /** データロードのエラーメッセージ */
  error?: string;
  /** ソート種類 */
  sortType: SortType;
  /** ソート降順フラグ */
  sortDesc: boolean;
  /** ソート種類変更コールバック */
  onSortTypeChange: (sortType: SortType) => void;
  /** ソート方向変更コールバック */
  onSortDescChange: (sortDesc: boolean) => void;
  // /** 全曲プロパティボタンクリックコールバック */
  // TrackListView 側でナビゲーションするかも？
  // onAllTracksPropsClick: (selectedIds: ReadonlySet<number>) => void;
}> = ({
  tracks,
  loading,
  error,
  sortType,
  sortDesc,
  onSortTypeChange,
  onSortDescChange,
}) => {
  // 選択状態管理 (選択モードでなければ undefined)
  const [selectedTrackIds, setSelectedTrackIds] = useState<
    ReadonlySet<number> | undefined
  >();

  /** 選択モード中の、リストの曲の選択状態の変更時 */
  const handleSelectionChange = (trackId: number, selected: boolean) => {
    const newSelection = new Set(selectedTrackIds);
    if (selected) {
      newSelection.add(trackId);
    } else {
      newSelection.delete(trackId);
    }
    setSelectedTrackIds(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = new Set(tracks.map((track) => track.id));
    setSelectedTrackIds(allIds);
  };

  const handleStartSelection = () => {
    setSelectedTrackIds(new Set());
  };

  const handleCancelSelection = () => {
    setSelectedTrackIds(undefined);
  };

  const handleTrackClick = (track: TrackListItemData) => {
    console.log("楽曲クリック:", track);
    // TODO: 楽曲プロパティ画面への遷移
  };

  const handleAllTracksPropsClick = () => {
    console.log("全曲プロパティクリック");
    // TODO: 全曲プロパティ画面への遷移
  };

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">
          エラーが発生しました: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      {/* ツールバー */}
      <TrackListToolbar
        sortType={sortType}
        sortDesc={sortDesc}
        onSortTypeChange={onSortTypeChange}
        onSortDescChange={onSortDescChange}
        selectionMode={selectedTrackIds !== undefined}
        onStartSelection={handleStartSelection}
        onSelectAll={handleSelectAll}
        onCancelSelection={handleCancelSelection}
        onAllTracksPropsClick={handleAllTracksPropsClick}
      />

      {/* 楽曲リスト */}
      {loading
        ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              読み込み中...
            </Typography>
          </Box>
        )
        : tracks.length === 0
        ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              該当する楽曲がありません
            </Typography>
          </Box>
        )
        : (
          <List sx={{ maxHeight: 600, overflow: "auto" }}>
            {tracks.map((track) => (
              <TrackListItem
                key={track.id}
                track={track}
                selected={selectedTrackIds?.has(track.id) === true}
                selectionMode={selectedTrackIds !== undefined}
                onSelectionChange={handleSelectionChange}
                onTrackClick={handleTrackClick}
              />
            ))}
          </List>
        )}
    </Paper>
  );
};
