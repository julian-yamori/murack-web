import React from "react";
import {
  deleteTagGroup,
  getDeleteTagGroupMutationKey,
  TagGroup,
} from "../gen/backend_api.ts";
import { mutate } from "swr";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export const TagGroupList: React.FC<{
  groups: TagGroup[] | undefined;
  startEdit: (group: TagGroup) => void;
  onDeleted: () => void;
}> = ({
  groups,
  startEdit,
  onDeleted,
}) => {
  if (!groups) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (groups.length === 0) {
    return (
      <Typography variant="body1" sx={{ textAlign: "center", p: 2 }}>
        タググループがありません。
      </Typography>
    );
  }

  const handleDelete = (id: number) => {
    if (globalThis.confirm("このグループを削除しますか？")) {
      void (async () => {
        await deleteTagGroup(id);
        await mutate(getDeleteTagGroupMutationKey(id));

        // 親コンポーネントに通知
        onDeleted();
      })();
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        タググループ一覧
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tag groups table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>グループ名</TableCell>
              <TableCell>並び順</TableCell>
              <TableCell>説明</TableCell>
              <TableCell>作成日時</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow
                key={group.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {group.id}
                </TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.order_index}</TableCell>
                <TableCell>{group.description || "-"}</TableCell>
                <TableCell>
                  {new Date(group.created_at).toLocaleString("ja-JP")}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => startEdit(group)}
                    >
                      編集
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(group.id)}
                    >
                      削除
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
