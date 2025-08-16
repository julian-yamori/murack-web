import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import {
  PlaylistListItem as PlaylistListItemData,
  PlaylistType,
} from "../gen/backend_api.ts";

/** プレイリスト一覧画面のリスト要素 */
export const PlaylistListItem: React.FC<{
  item: PlaylistListItemData;
  onClick?: (item: PlaylistListItemData) => unknown;
}> = ({ item, onClick }) => {
  return (
    <>
      <Divider />
      <ListItem
        component="div"
        onClick={onClick !== undefined ? () => onClick(item) : undefined}
        sx={{
          cursor: onClick ? "pointer" : "default",
          "&:hover": {
            backgroundColor: onClick ? "action.hover" : "transparent",
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={typeIconSrc(item.playlist_type)}
            sx={{
              width: 32,
              height: 32,
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
    </>
  );
};

function typeIconSrc(type: PlaylistType): string {
  switch (type) {
    case "Normal":
      return "/image/plist_normal.png";
    case "Filter":
      return "/image/plist_filter.png";
    case "Folder":
      return "/image/plist_folder.png";
  }
}
