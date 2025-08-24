import { List, Typography } from "@mui/material";
import { GroupListItem, GroupListItemAll } from "./GroupListItem.tsx";
import type { GroupListItem as GroupListItemData } from "../gen/backend_api.ts";

/** 各グループ選択画面の共通画面レイアウト */
export const GroupListLayout: React.FC<{
  list_data: GroupListItemData[];

  /** `全てのXX` のリスト要素の項目名 */
  allItemText?: string;

  /** リストの空文字列値の代わりに表示するテキスト */
  emptyItemText: string;

  onItemClick: (item: GroupListItemData | "all") => unknown;
}> = ({
  list_data,
  emptyItemText,
  allItemText,
  onItemClick,
}) => {
  if (list_data.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
        データがありません
      </Typography>
    );
  }

  return (
    <List>
      {allItemText !== undefined
        ? (
          <GroupListItemAll
            text={allItemText}
            onClick={() => onItemClick("all")}
          />
        )
        : null}
      {list_data.map((item: GroupListItemData, index: number) => (
        <GroupListItem
          key={index}
          item={item}
          viewText={listItemViewText(item, emptyItemText)}
          onClick={onItemClick}
        />
      ))}
    </List>
  );
};

function listItemViewText(
  item: GroupListItemData,
  emptyItemText: string,
): string | undefined {
  const { name } = item;

  if (name === "") {
    return emptyItemText;
  } else {
    return name;
  }
}
