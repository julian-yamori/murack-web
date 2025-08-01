import { useMemo, useState } from "react";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { TagGroupList } from "./test_tag_group/TagGroupList.tsx";
import { TagGroupForm } from "./test_tag_group/TagGroupForm.tsx";
import { TagGroup, useGetTagGroups } from "./gen/backend_api.ts";
import { getTagGroupsResponse } from "./gen/backend_api.zod.ts";

function App() {
  const { data: groupsResponse, error, mutate: mutateGroups } =
    useGetTagGroups();

  const groups = useMemo(() => {
    // 型チェック
    return getTagGroupsResponse.optional().parse(groupsResponse?.data);
  }, [groupsResponse]);

  const [editingGroup, setEditingGroup] = useState<TagGroup | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingGroup(null);
    setShowForm(true);
  };

  const handleStartEdit = (group: TagGroup) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGroup(null);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Murack Web
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          楽曲ライブラリ管理システム
        </Typography>
      </Box>

      <Box component="main">
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
    </Container>
  );
}

export default App;
