import React from "react";
import {
  deleteTagGroup,
  getDeleteTagGroupMutationKey,
  TagGroup,
} from "../gen/backend_api.ts";
import { mutate } from "swr";

interface TagGroupListProps {
  groups: TagGroup[] | undefined;
  startEdit: (group: TagGroup) => void;
  onDeleted: () => void;
}

export const TagGroupList: React.FC<TagGroupListProps> = ({
  groups,
  startEdit,
  onDeleted,
}) => {
  if (!groups) {
    return <div>Loading...</div>;
  }

  if (groups.length === 0) {
    return <div>タググループがありません。</div>;
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
    <div>
      <h2>タググループ一覧</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              グループ名
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              並び順
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              説明
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              作成日時
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {group.id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {group.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {group.order_index}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {group.description || "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(group.created_at).toLocaleString("ja-JP")}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  type="button"
                  onClick={() => startEdit(group)}
                  style={{ marginRight: "8px" }}
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(group.id)}
                  style={{ color: "red" }}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
