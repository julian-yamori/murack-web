import React, { useEffect, useState } from "react";
import {
  createTagGroup,
  getCreateTagGroupMutationKey,
  getUpdateTagGroupMutationKey,
  TagGroup,
  updateTagGroup,
} from "../gen/backend_api.ts";
import { mutate } from "swr";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

export const TagGroupForm: React.FC<{
  editingGroup: TagGroup | undefined;
  closeForm: () => void;
}> = ({
  editingGroup,
  closeForm,
}) => {
  const [name, setName] = useState("");
  const [orderIndex, setOrderIndex] = useState<number | undefined>();
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSending(false);
    if (editingGroup) {
      setName(editingGroup.name);
      setOrderIndex(editingGroup.order_index);
      setDescription(editingGroup.description);
    } else {
      setName("");
      setOrderIndex(undefined);
      setDescription("");
    }
  }, [editingGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || orderIndex === undefined) {
      alert("グループ名と順番は必須です。");
      return;
    }

    if (Number.isNaN(orderIndex)) {
      alert("並び順が数値ではありません");
      return;
    }

    const groupData = {
      name: name.trim(),
      order_index: orderIndex,
      description: description.trim(),
    };

    setSending(true);

    void (async () => {
      if (editingGroup) {
        await updateTagGroup(editingGroup.id, groupData);
        await mutate(getUpdateTagGroupMutationKey(editingGroup.id));
      } else {
        await createTagGroup(groupData);
        await mutate(getCreateTagGroupMutationKey());
      }
      closeForm();
    })();
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {editingGroup ? "楽曲編集" : "楽曲追加"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="グループ名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={sending}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="並び順"
            type="number"
            value={orderIndex ?? ""}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
            required
            disabled={sending}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={sending}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
          />

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={sending}
            >
              {sending ? "処理中..." : editingGroup ? "更新" : "追加"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={closeForm}
              disabled={sending}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
