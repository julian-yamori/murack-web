import { Box, List, Typography } from "@mui/material";
import { TrackListItem } from "./TrackListItem.tsx";
import { TrackListItem as TrackListItemData } from "../gen/backend_api.ts";
import { SelectedTrackIds } from "./track_selection.tsx";

/** 曲リストのコンポーネント */
export const TrackListView: React.FC<{
  /** 表示する楽曲のリスト */
  tracks: ReadonlyArray<TrackListItemData>;
  selectedTrackIds: SelectedTrackIds;
  onTrackClick: (item: TrackListItemData) => unknown;
  setSelectedTrackIds: (value: SelectedTrackIds) => unknown;
}> = ({
  tracks,
  selectedTrackIds,
  onTrackClick,
  setSelectedTrackIds,
}) => {
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

  return (
    <>
      {tracks.length === 0
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
                onTrackClick={onTrackClick}
              />
            ))}
          </List>
        )}
    </>
  );
};
