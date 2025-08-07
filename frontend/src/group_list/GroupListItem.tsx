import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import type { GroupListItem as GroupListItemData } from "../gen/backend_api.ts";
import { API_BASE_URL } from "../api_base_url.ts";

/** グループ選択画面のリスト要素 (検索結果から取得した値) */
export const GroupListItem: React.FC<{
  item: GroupListItemData;
  viewText?: string;
  onClick?: (item: GroupListItemData) => unknown;
}> = ({
  item,
  viewText,
  onClick,
}) => {
  return (
    <GroupListItemView
      text={viewText ?? item.name}
      thumbSrc={getArtworkSrc(item.artwork_id)}
      onClick={onClick !== undefined ? () => onClick(item) : undefined}
    />
  );
};

/** グループ選択画面のリスト要素 (`全てのXX` のリスト項目) */
export const GroupListItemAll: React.FC<{
  text: string;
  onClick?: () => unknown;
}> = ({
  text,
  onClick,
}) => {
  return (
    <GroupListItemView
      text={text}
      thumbSrc="/artwork_none.png"
      onClick={onClick}
    />
  );
};

/** グループ選択画面のリスト要素 (共通の表示用コンポーネント) */
export const GroupListItemView: React.FC<{
  text: string;
  thumbSrc: string;
  onClick?: () => unknown;
}> = ({
  text,
  thumbSrc,
  onClick,
}) => {
  return (
    <>
      <Divider />
      <ListItem
        component="div"
        onClick={onClick}
        sx={{
          cursor: onClick ? "pointer" : "default",
          "&:hover": {
            backgroundColor: onClick ? "action.hover" : "transparent",
          },
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={thumbSrc}
            variant="rounded"
            sx={{
              width: 56,
              height: 56,
              mr: 2,
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="h6" component="div">
              {text}
            </Typography>
          }
        />
      </ListItem>
    </>
  );
};

function getArtworkSrc(artworkId: number | null | undefined): string {
  if (artworkId === null || artworkId === undefined) {
    return "/artwork_none.png";
  }
  return `${API_BASE_URL}/api/artworks/${artworkId}/mini`;
}
