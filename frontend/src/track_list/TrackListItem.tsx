import {
  Box,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { TrackListItem as TrackListItemData } from "../gen/backend_api.ts";
import { ListArtwork } from "../common_components/ListArtwork.tsx";

/** 個別楽曲項目コンポーネント */
export const TrackListItem: React.FC<{
  /** 楽曲データ */
  track: TrackListItemData;
  /** 選択されているかどうか */
  selected: boolean;
  /** 選択モードかどうか */
  selectionMode: boolean;
  /** 選択状態変更コールバック */
  onSelectionChange: (trackId: number, selected: boolean) => void;
  /** 楽曲クリックコールバック */
  onTrackClick: (track: TrackListItemData) => void;
}> = ({
  track,
  selected,
  selectionMode,
  onSelectionChange,
  onTrackClick,
}) => {
  const handleClick = () => {
    if (selectionMode) {
      onSelectionChange(track.id, !selected);
    } else {
      onTrackClick(track);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onSelectionChange(track.id, event.target.checked);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick} selected={selected}>
        <ListItemAvatar>
          <ListArtwork artworkId={track.artwork_id} size={28} />
        </ListItemAvatar>
        <ListItemText
          primary={track.title}
          primaryTypographyProps={{ noWrap: true }}
        />
        {selectionMode && (
          <Box sx={{ ml: 2 }}>
            <Checkbox
              checked={selected}
              onChange={handleCheckboxChange}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </ListItemButton>
    </ListItem>
  );
};
