import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { TagGroupList } from "./components/TagGroupList.tsx";
import { TagGroupForm } from "./components/TagGroupForm.tsx";
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
    return <div style={{ color: "red" }}>Error</div>;
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <h1>Murack Web プロトタイプ</h1>
        <p>楽曲ライブラリ管理システム</p>
      </header>

      <main>
        <div style={{ marginBottom: "16px" }}>
          <Button variant="contained" onClick={handleAddNew}>
            新しい楽曲を追加
          </Button>
        </div>

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
      </main>

      <footer
        style={{
          marginTop: "40px",
          padding: "16px 0",
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#666",
        }}
      >
        <p>Murack Web プロトタイプ - 技術検証用アプリケーション</p>
      </footer>
    </div>
  );
}

export default App;
