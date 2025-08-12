import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  ArrowUpward,
  CheckBox,
  CheckBoxOutlineBlank,
  Close,
  Settings,
} from "@mui/icons-material";
import { SortType } from "../gen/backend_api.ts";
import { sortTypeSchema } from "../backend_types.ts";

/** ソート種類の表示名マッピング */
const SORT_TYPE_LABELS: Record<SortType, string> = {
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
};

/** 曲リスト画面のツールバーコンポーネント */
export const TrackListToolbar: React.FC<{
  /** ソート種類 */
  sortType: SortType;
  /** ソート降順フラグ */
  sortDesc: boolean;
  /** ソート種類変更コールバック */
  onSortTypeChange: (sortType: SortType) => void;
  /** ソート方向変更コールバック */
  onSortDescChange: (sortDesc: boolean) => void;
  /** 選択モードかどうか */
  selectionMode: boolean;
  /** 選択モード開始コールバック */
  onStartSelection: () => void;
  /** 全選択コールバック */
  onSelectAll: () => void;
  /** 選択キャンセルコールバック */
  onCancelSelection: () => void;
  /** 全曲プロパティボタンクリックコールバック */
  onAllTracksPropsClick: () => void;
}> = ({
  sortType,
  sortDesc,
  onSortTypeChange,
  onSortDescChange,
  selectionMode,
  onStartSelection,
  onSelectAll,
  onCancelSelection: onDeselectAll,
  onAllTracksPropsClick,
}) => {
  const handleSortTypeChange = (event: SelectChangeEvent<SortType>) => {
    const newValue = sortTypeSchema.parse(event.target.value);
    onSortTypeChange(newValue);
  };

  const handleSortDirectionToggle = () => {
    onSortDescChange(!sortDesc);
  };

  const handleSelectionModeToggle = () => {
    onStartSelection();
  };

  return (
    <Toolbar variant="dense" sx={{ gap: 1, minHeight: 48 }}>
      {/* ソート種類選択 */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
        <InputLabel>ソート</InputLabel>
        <Select
          value={sortType}
          onChange={handleSortTypeChange}
          label="ソート"
        >
          {Object.entries(SORT_TYPE_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ソート方向切り替えボタン */}
      <Tooltip title={sortDesc ? "降順" : "昇順"}>
        <IconButton onClick={handleSortDirectionToggle} size="small">
          <ArrowUpward
            sx={{
              transform: sortDesc ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
            color="primary"
          />
        </IconButton>
      </Tooltip>

      <Box sx={{ flexGrow: 1 }} />

      {/* 選択モードのボタン群 */}
      {selectionMode
        ? (
          <>
            <Button
              startIcon={<CheckBox />}
              onClick={onSelectAll}
              variant="outlined"
              size="small"
            >
              全選択
            </Button>
            <Button
              startIcon={<Close />}
              onClick={onDeselectAll}
              variant="outlined"
              size="small"
              color="secondary"
            >
              選択をキャンセル
            </Button>
          </>
        )
        : (
          <Button
            startIcon={<CheckBoxOutlineBlank />}
            onClick={handleSelectionModeToggle}
            variant="outlined"
            size="small"
          >
            選択モード
          </Button>
        )}

      {/* 全曲プロパティボタン */}
      <Button
        startIcon={<Settings />}
        onClick={onAllTracksPropsClick}
        variant="outlined"
        size="small"
        disabled
      >
        全曲プロパティ
      </Button>
    </Toolbar>
  );
};
