import React from "react";
import {
  useGetPlaylistDetails,
  useGetPlaylistList,
} from "../gen/backend_api.ts";
import { PlaylistListLayout } from "./PlaylistListLayout.tsx";
import { LoadingErrorAlert } from "../common_components/LoadingErrorAlert.tsx";
import { LoadingView } from "../common_components/LoadingView.tsx";

/** プレイリストフォルダの、子プレイリストの一覧画面 */
export const ChildListPage: React.FC<{
  /** 親のプレイリストフォルダの ID */
  parentId: number;
}> = (
  { parentId },
) => {
  const { data: listData, error: listError } = useGetPlaylistList({
    parent_id: parentId,
  });
  const { data: detailData, error: detailError } = useGetPlaylistDetails(
    parentId,
  );

  const error = listError || detailError;
  if (error) {
    return <LoadingErrorAlert error={error} />;
  }
  if (listData === undefined || detailData === undefined) {
    return <LoadingView />;
  }

  return (
    <PlaylistListLayout
      listData={listData.data}
      parentPlaylist={detailData.data}
    />
  );
};
