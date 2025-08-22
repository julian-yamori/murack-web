// backend API の型定義のうち、orval で生成されないものがある対策

import {
  getPlaylistDetailsResponse,
  getTrackListQueryParams,
} from "./gen/backend_api.zod.ts";

// zod schema の getTrackListQueryParams から SortType を抽出
export const sortTypeSchema = getTrackListQueryParams.shape.sort_type;

// zod schema の getPlaylistDetailsResponse から SortTypeWithPlaylist を抽出
export const sortTypeWithPlaylistSchema =
  getPlaylistDetailsResponse.shape.sort_type;
