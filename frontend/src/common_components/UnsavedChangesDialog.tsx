// 未保存の編集画面を閉じる際、保存するか確認するダイアログ

import { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

/**
 * UnsavedChangesDialog に渡す引数
 *
 * このオブジェクトの中身は、SingleTrackModal 側で参照する想定
 */
export type UnsavedChangesDialogArgs =
  & OpenUnsavedChangesDialogArgs
  & Readonly<{
    /**
     * Dialog を閉じる関数
     */
    close: () => void;
  }>;

/** UnsavedChangesDialog を開くときの引数 */
export type OpenUnsavedChangesDialogArgs = Readonly<{
  /** 「保存する」が選択されたときに実行する保存処理 */
  doSave: () => Promise<unknown>;

  /** 「保存する」「保存しない」が選択されたときに実行する画面遷移処理 */
  doNavigate?: () => unknown;
}>;

/**
 * UnsavedChangesDialog の状態を親コンポーネントで保持する hook
 */
export function useUnsavedChangesDialog(): {
  /** UnsavedChangesDialog の引数。開いてない場合は undefined */
  dialogArgs: UnsavedChangesDialogArgs | undefined;

  /** UnsavedChangesDialogArgs を開く関数 */
  open: (args: OpenUnsavedChangesDialogArgs) => void;
} {
  const [dialogArgs, setDialogArgs] = useState<
    UnsavedChangesDialogArgs | undefined
  >();

  const open = useCallback(
    ({ doSave, doNavigate }: OpenUnsavedChangesDialogArgs) => {
      setDialogArgs({
        doSave,
        doNavigate,
        close: () => setDialogArgs(undefined),
      });
    },
    [],
  );

  return { dialogArgs, open };
}

/** 未保存の編集画面を閉じる際、保存するか確認するダイアログ */
export const UnsavedChangesDialog: React.FC<
  { dialogArgs: UnsavedChangesDialogArgs | undefined }
> = ({ dialogArgs }) => {
  const handleSave = async () => {
    if (dialogArgs === undefined) {
      throw new Error("UnsavedChangesDialog : args is undefined");
    }
    const { doSave, doNavigate, close } = dialogArgs;

    await doSave();

    close();

    if (doNavigate) {
      doNavigate();
    }
  };

  const handleDiscard = () => {
    if (dialogArgs === undefined) {
      throw new Error("UnsavedChangesDialog : args is undefined");
    }
    const { doNavigate, close } = dialogArgs;

    close();

    if (doNavigate) {
      doNavigate();
    }
  };

  return (
    <Dialog
      open={dialogArgs !== undefined}
      onClose={dialogArgs?.close}
    >
      <DialogTitle>未保存の変更があります</DialogTitle>
      <DialogContent>
        <Typography>
          変更内容を保存しますか？
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogArgs?.close}>
          編集を続ける
        </Button>
        <Button onClick={handleDiscard}>
          保存しない
        </Button>
        <Button onClick={handleSave} variant="contained">
          保存する
        </Button>
      </DialogActions>
    </Dialog>
  );
};
