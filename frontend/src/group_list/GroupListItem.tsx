import {
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import type { GroupListItem as GroupListItemData } from "../gen/backend_api.ts";
import { ListArtwork } from "../common_components/ListArtwork.tsx";

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
      artworkId={item.artwork_id}
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
      artworkId={undefined}
      onClick={onClick}
    />
  );
};

/** グループ選択画面のリスト要素 (共通の表示用コンポーネント) */
export const GroupListItemView: React.FC<{
  text: string;
  artworkId: number | null | undefined;
  onClick?: () => unknown;
}> = ({
  text,
  artworkId,
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
          <ListArtwork artworkId={artworkId} size={56} />
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
