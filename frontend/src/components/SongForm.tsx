import React, { useEffect, useState } from "react";
import {
  createSong,
  getCreateSongMutationKey,
  getUpdateSongMutationKey,
  Song,
  updateSong,
} from "../gen/backend_api";
import { mutate } from "swr";

interface SongFormProps {
  editingSong: Song | null;
  closeForm: () => void;
}

export const SongForm: React.FC<SongFormProps> = ({
  editingSong,
  closeForm,
}) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setSending(false);
    if (editingSong) {
      setTitle(editingSong.title);
      setArtist(editingSong.artist);
      setAlbum(editingSong.album || "");
    } else {
      setTitle("");
      setArtist("");
      setAlbum("");
    }
  }, [editingSong]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !artist.trim()) {
      alert("タイトルとアーティストは必須です。");
      return;
    }

    const songData = {
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || null,
    };

    setSending(true);

    void (async () => {
      if (editingSong) {
        await updateSong(editingSong.id, songData);
        await mutate(getUpdateSongMutationKey(editingSong.id));
      } else {
        await createSong(songData);
        await mutate(getCreateSongMutationKey());
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
      <h3>{editingSong ? "楽曲編集" : "楽曲追加"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label
            htmlFor="title"
            style={{ display: "block", marginBottom: "4px" }}
          >
            タイトル *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            htmlFor="artist"
            style={{ display: "block", marginBottom: "4px" }}
          >
            アーティスト *
          </label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
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
            htmlFor="album"
            style={{ display: "block", marginBottom: "4px" }}
          >
            アルバム
          </label>
          <input
            id="album"
            type="text"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
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
            {sending ? "処理中..." : editingSong ? "更新" : "追加"}
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
