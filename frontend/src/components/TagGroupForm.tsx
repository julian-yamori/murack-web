import React, { useEffect, useState } from "react";
import {
  createTagGroup,
  getCreateTagGroupMutationKey,
  getUpdateTagGroupMutationKey,
  TagGroup,
  updateTagGroup,
} from "../gen/backend_api.ts";
import { mutate } from "swr";

interface TagGroupFormProps {
  editingGroup: TagGroup | null;
  closeForm: () => void;
}

export const TagGroupForm: React.FC<TagGroupFormProps> = ({
  editingGroup,
  closeForm,
}) => {
  const [name, setName] = useState("");
  const [orderIndex, setOrderIndex] = useState<number | null>(null);
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
      setOrderIndex(null);
      setDescription("");
    }
  }, [editingGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || orderIndex === null) {
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
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        marginBottom: "16px",
        borderRadius: "4px",
      }}
    >
      <h3>{editingGroup ? "楽曲編集" : "楽曲追加"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label
            htmlFor="name"
            style={{ display: "block", marginBottom: "4px" }}
          >
            グループ名 *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            required
            disabled={sending}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label
            htmlFor="order_index"
            style={{ display: "block", marginBottom: "4px" }}
          >
            並び順 *
          </label>
          <input
            id="order_index"
            type="text"
            value={orderIndex ?? ""}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            required
            disabled={sending}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: "4px" }}
          >
            説明
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            disabled={sending}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={sending}
            style={{
              marginRight: "8px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: sending ? "not-allowed" : "pointer",
            }}
          >
            {sending ? "処理中..." : editingGroup ? "更新" : "追加"}
          </button>
          <button
            type="button"
            onClick={closeForm}
            disabled={sending}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: sending ? "not-allowed" : "pointer",
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};
