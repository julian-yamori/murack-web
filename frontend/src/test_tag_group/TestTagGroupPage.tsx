import { useMemo, useState } from "react";
import { Alert, Box, Button, Container } from "@mui/material";
import { TagGroupList } from "./TagGroupList.tsx";
import { TagGroupForm } from "./TagGroupForm.tsx";
import { TagGroup, useGetTagGroups } from "../gen/backend_api.ts";
import { getTagGroupsResponse } from "../gen/backend_api.zod.ts";
import { NavBreadcrumbs } from "../navigation/NavBreadcrumbs.tsx";

/**
 * タググループリストのページ (プロトタイプ用)
 */
export const TestTagGroupPage: React.FC = () => {
  const { data: groupsResponse, error, mutate: mutateGroups } =
    useGetTagGroups();

  const groups = useMemo(() => {
    // 型チェック
    return getTagGroupsResponse.optional().parse(groupsResponse?.data);
  }, [groupsResponse]);

  const [editingGroup, setEditingGroup] = useState<TagGroup | undefined>();
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingGroup(undefined);
    setShowForm(true);
  };

  const handleStartEdit = (group: TagGroup) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGroup(undefined);
    void mutateGroups();
  };

  const handleDeleted = () => {
    void mutateGroups();
  };

  if (error) {
    console.error(error);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Error loading data</Alert>
      </Container>
    );
  }

  return (
    <Box component="main">
      <NavBreadcrumbs />

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleAddNew}>
          新しい楽曲を追加
        </Button>
      </Box>

      {showForm && (
        <TagGroupForm
          editingGroup={editingGroup}
          closeForm={handleCloseForm}
        />
      )}

      <TagGroupList
        groups={groups}
        startEdit={handleStartEdit}
        onDeleted={handleDeleted}
      />
    </Box>
  );
};
