// 非同期処理中に画面をロックする機能

import { Backdrop, CircularProgress } from "@mui/material";
import React, { useCallback, useState } from "react";

/**
 * lockScreen() 内で実行する非同期処理
 *
 * この関数が終了したとき (もしくは reject されたとき)、isLocked が false に戻る
 */
export type LockScreenInner = () => Promise<unknown>;

/** 画面ロックのフラグを管理する hook */
export function useScreenLock(): {
  isLocked: boolean;

  /** isLocked フラグを立てて非同期処理を実行 */
  lockScreen: (fn: LockScreenInner) => Promise<void>;
} {
  const [isLocked, setIsLocked] = useState(false);

  const lockScreen = useCallback(async (fn: () => Promise<unknown>) => {
    setIsLocked(true);

    try {
      await fn();
    } finally {
      setIsLocked(false);
    }
  }, []);

  return { lockScreen, isLocked };
}

/** isLocked フラグが立っているときに画面全体を暗転させてロックするコンポーネント */
export const ScreenLockBackdrop: React.FC<{ isLocked: boolean }> = (
  { isLocked },
) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLocked}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
