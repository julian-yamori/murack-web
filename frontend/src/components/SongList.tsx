import React from "react";
import {
  deleteSong,
  getDeleteSongMutationKey,
  Song,
} from "../gen/backend_api.ts";
import { mutate } from "swr";

interface SongListProps {
  songs: Song[] | undefined;
  startEdit: (song: Song) => void;
  onDeleted: () => void;
}

export const SongList: React.FC<SongListProps> = ({
  songs,
  startEdit,
  onDeleted,
}) => {
  if (!songs) {
    return <div>Loading...</div>;
  }

  if (songs.length === 0) {
    return <div>楽曲がありません。</div>;
  }

  const handleDelete = (id: number) => {
    if (globalThis.confirm("この楽曲を削除しますか？")) {
      void (async () => {
        await deleteSong(id);
        await mutate(getDeleteSongMutationKey(id));

        // 親コンポーネントに通知
        onDeleted();
      })();
    }
  };

  return (
    <div>
      <h2>楽曲一覧</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              タイトル
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              アーティスト
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              アルバム
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              作成日時
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr key={song.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {song.id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {song.title}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {song.artist}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {song.album || "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(song.created_at).toLocaleString("ja-JP")}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  type="button"
                  onClick={() => startEdit(song)}
                  style={{ marginRight: "8px" }}
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(song.id)}
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
