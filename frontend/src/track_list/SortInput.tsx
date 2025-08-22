import React from "react";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { SortType, SortTypeWithPlaylist } from "../gen/backend_api.ts";
import {
  sortTypeSchema,
  sortTypeWithPlaylistSchema,
} from "../backend_types.ts";
import { ArrowUpward } from "@mui/icons-material";

/** ソート種類の表示名マッピング */
const TYPE_LABELS = new Map(Object.entries({
  track_name: "曲名順",
  artist: "アーティスト順",
  album: "アルバム順",
  genre: "ジャンル順",
  composer: "作曲者順",
  duration: "再生時間順",
  track_index: "トラック番号順",
  disc_index: "ディスク番号順",
  release_date: "リリース日順",
  rating: "レート順",
  entry_date: "登録日順",
  path: "パス順",
}));

/** ソート設定の入力欄 */
export const SortInput: React.FC<{
  /** ソート種類 */
  sortType: SortType;
  /** ソート降順フラグ */
  sortDesc: boolean;
  /** ソート種類変更コールバック */
  onTypeChange: (sortType: SortType) => unknown;
  /** ソート方向変更コールバック */
  onDescChange: (sortDesc: boolean) => unknown;
}> = ({
  sortType,
  sortDesc,
  onTypeChange,
  onDescChange,
}) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    const parsed = sortTypeSchema.parse(event.target.value);
    onTypeChange(parsed);
  };

  return (
    <>
      <TypeSelect
        sortType={sortType}
        labelMapping={TYPE_LABELS}
        onChange={handleTypeChange}
      />

      <DirectionButton
        sortDesc={sortDesc}
        onChange={onDescChange}
      />
    </>
  );
};

/** ソート種類の表示名マッピング (プレイリスト順付き) */
const TYPE_LABELS_WP = new Map([
  ["playlist", "プレイリスト順"],
  ...TYPE_LABELS,
]);

/** ソート設定の入力欄 (プレイリスト順付き) */
export const SortInputWithPlaylist: React.FC<{
  /** ソート種類 */
  sortType: SortTypeWithPlaylist;
  /** ソート降順フラグ */
  sortDesc: boolean;

  /**「プレイリスト順」を使用するかどうか */
  enablePlaylist: boolean;

  /** ソート種類変更コールバック */
  onTypeChange: (sortType: SortTypeWithPlaylist) => unknown;
  /** ソート方向変更コールバック */
  onDescChange: (sortDesc: boolean) => unknown;
}> = ({
  sortType,
  sortDesc,
  enablePlaylist,
  onTypeChange,
  onDescChange,
}) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    const parsed = sortTypeWithPlaylistSchema.parse(event.target.value);
    onTypeChange(parsed);
  };

  return (
    <>
      <TypeSelect
        sortType={sortType}
        labelMapping={enablePlaylist ? TYPE_LABELS_WP : TYPE_LABELS}
        onChange={handleTypeChange}
      />

      <DirectionButton
        sortDesc={sortDesc}
        onChange={onDescChange}
      />
    </>
  );
};

/** ソート種類選択 */
const TypeSelect: React.FC<{
  sortType: string;
  labelMapping: ReadonlyMap<string, string>;
  onChange: (e: SelectChangeEvent) => unknown;
}> = ({
  sortType,
  labelMapping,
  onChange,
}) => {
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <InputLabel>ソート</InputLabel>
      <Select
        value={sortType}
        onChange={onChange}
        label="ソート"
      >
        {[...labelMapping].map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

/** ソート方向切り替えボタン */
const DirectionButton: React.FC<
  { sortDesc: boolean; onChange: (sortDesc: boolean) => void }
> = ({ sortDesc, onChange }) => {
  const handleClick = () => {
    onChange(!sortDesc);
  };

  return (
    <Tooltip title={sortDesc ? "降順" : "昇順"}>
      <IconButton onClick={handleClick} size="small">
        <ArrowUpward
          sx={{
            transform: sortDesc ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
          color="primary"
        />
      </IconButton>
    </Tooltip>
  );
};
