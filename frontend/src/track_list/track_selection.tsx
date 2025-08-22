import { Button } from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank, Close } from "@mui/icons-material";

/**
 * 選択中の曲の ID リスト
 * 選択モードでなければ undefined
 */
export type SelectedTrackIds = ReadonlySet<number> | undefined;

/** 曲リスト画面の選択モードに関する、ツールバーのボタン群 */
export const TrackSelectionButtons: React.FC<{
  selectedTrackIds: SelectedTrackIds;
  allIds: ReadonlyArray<number>;
  setSelectedTrackIds: (value: SelectedTrackIds) => unknown;
}> = ({
  selectedTrackIds,
  allIds,
  setSelectedTrackIds,
}) => {
  const handleSelectAll = () => {
    setSelectedTrackIds(new Set(allIds));
  };

  const handleCancelSelection = () => {
    setSelectedTrackIds(undefined);
  };

  const handleStartSelection = () => {
    setSelectedTrackIds(new Set());
  };

  if (selectedTrackIds !== undefined) {
    // 選択モード中に表示するボタン
    return (
      <>
        <Button
          startIcon={<CheckBox />}
          onClick={handleSelectAll}
          variant="outlined"
          size="small"
        >
          全選択
        </Button>
        <Button
          startIcon={<Close />}
          onClick={handleCancelSelection}
          variant="outlined"
          size="small"
          color="secondary"
        >
          選択をキャンセル
        </Button>
      </>
    );
  } else {
    // 選択モードを開始するボタン
    return (
      <Button
        startIcon={<CheckBoxOutlineBlank />}
        onClick={handleStartSelection}
        variant="outlined"
        size="small"
      >
        選択モード
      </Button>
    );
  }
};
