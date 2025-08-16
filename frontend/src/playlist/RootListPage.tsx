import React from "react";
import { useGetPlaylistList } from "../gen/backend_api.ts";
import { PlaylistListLayout } from "./PlaylistListLayout.tsx";

/** 最上位プレイリストの一覧画面 */
export const RootListPage: React.FC = () => {
  const { data: listData, error: listError, isLoading: isListLoading } =
    useGetPlaylistList();

  return (
    <PlaylistListLayout
      listData={listData?.data}
      parentPlaylist={undefined}
      error={listError}
      isLoading={isListLoading}
    />
  );
};
