import React from "react";
import {
  useGetPlaylistDetails,
  useGetPlaylistList,
} from "../gen/backend_api.ts";
import { PlaylistListLayout } from "./PlaylistListLayout.tsx";

/** プレイリストフォルダの、子プレイリストの一覧画面 */
export const ChildListPage: React.FC<{
  /** 親のプレイリストフォルダの ID */
  parentId: number;
}> = (
  { parentId },
) => {
  const { data: listData, error: listError, isLoading: isListLoading } =
    useGetPlaylistList({ parent_id: parentId });
  const { data: detailData, error: detailError, isLoading: isDetailLoading } =
    useGetPlaylistDetails(parentId);

  return (
    <PlaylistListLayout
      listData={listData?.data}
      parentPlaylist={detailData?.data}
      error={listError || detailError}
      isLoading={isListLoading || isDetailLoading}
    />
  );
};
