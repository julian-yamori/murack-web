import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import type { GroupListItem as GroupListItemData } from "../gen/backend_api.ts";
import { API_BASE_URL } from "../api_base_url.ts";

export const GroupListItem: React.FC<{
  item: GroupListItemData;
  onClick?: (item: GroupListItemData) => unknown;
}> = ({
  item,
  onClick,
}) => {
  return (
    <ListItem
      component="div"
      onClick={() => onClick?.(item)}
      sx={{
        padding: 2,
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          backgroundColor: onClick ? "action.hover" : "transparent",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={getArtworkSrc(item.artwork_id)}
          variant="rounded"
          sx={{
            width: 56,
            height: 56,
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="h6" component="div">
            {item.name}
          </Typography>
        }
      />
    </ListItem>
  );
};

function getArtworkSrc(artworkId: number | null | undefined): string {
  if (artworkId === null || artworkId === undefined) {
    return "/artwork_none.png";
  }
  return `${API_BASE_URL}/api/artworks/${artworkId}/mini`;
}
