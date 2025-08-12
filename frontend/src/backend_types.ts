// backend API の型定義のうち、orval で生成されないものがある対策

import { getTrackListQueryParams } from "./gen/backend_api.zod.ts";

// zod schema の getTrackListQueryParams から SortType を抽出
export const sortTypeSchema = getTrackListQueryParams.shape.sort_type;
