import React from "react";
import { useGetPlaylistList } from "../gen/backend_api.ts";
import { PlaylistListLayout } from "./PlaylistListLayout.tsx";
import { LoadingErrorAlert } from "../common_components/LoadingErrorAlert.tsx";
import { LoadingView } from "../common_components/LoadingView.tsx";

/** 最上位プレイリストの一覧画面 */
export const RootListPage: React.FC = () => {
  const { data: listData, error } = useGetPlaylistList();

  if (error) {
    return <LoadingErrorAlert error={error} />;
  }
  if (listData === undefined) {
    return <LoadingView />;
  }

  return (
    <PlaylistListLayout
      listData={listData?.data}
      parentPlaylist={undefined}
    />
  );
};
