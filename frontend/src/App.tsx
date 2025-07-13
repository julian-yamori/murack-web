import { useMemo, useState } from "react";
import { SongList } from "./components/SongList";
import { SongForm } from "./components/SongForm";
import { Song, useGetSongs } from "./gen/backend_api";
import { getSongsResponse } from "./gen/backend_api.zod";

function App() {
  const { data: songsResponse, error, mutate: mutateSongs } = useGetSongs();

  const songs = useMemo(() => {
    // 型チェック
    return getSongsResponse.optional().parse(songsResponse?.data);
  }, [songsResponse]);

  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingSong(null);
    setShowForm(true);
  };

  const handleStartEdit = (song: Song) => {
    setEditingSong(song);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSong(null);
    void mutateSongs();
  };

  const handleDeleted = () => {
    void mutateSongs();
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
          <button
            onClick={handleAddNew}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            新しい楽曲を追加
          </button>
        </div>

        {showForm && (
          <SongForm editingSong={editingSong} closeForm={handleCloseForm} />
        )}

        <SongList
          songs={songs}
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
