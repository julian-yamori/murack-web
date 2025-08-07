import { Alert, Box, CircularProgress, List, Typography } from "@mui/material";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";
import { GroupListItem } from "./GroupListItem.tsx";
import type { GroupListItem as GroupListItemData } from "../gen/backend_api.ts";

/** 各グループ選択画面の共通画面レイアウト */
export const GroupListLayout: React.FC<{
  list_data: GroupListItemData[] | undefined;
  error: unknown;
  isLoading: boolean;

  onItemClick: (item: GroupListItemData) => unknown;
}> = ({
  list_data,
  error,
  isLoading,
  onItemClick,
}) => {
  return (
    <Box component="main">
      <NavBreadcrumbs />

      {isLoading && (
        <Box display="flex" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error
        ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            データの読み込みに失敗しました
          </Alert>
        )
        : null}

      {list_data && (
        <List>
          {list_data.map((item: GroupListItemData, index: number) => (
            <GroupListItem
              key={index}
              item={item}
              onClick={onItemClick}
            />
          ))}
        </List>
      )}

      {list_data && list_data.length === 0 && !isLoading && (
        <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
          データがありません
        </Typography>
      )}
    </Box>
  );
};
