import { useCallback, useState } from "react";

/**
 * SingleTrackModal に渡す引数
 *
 * このオブジェクトの中身は、SingleTrackModal 側で参照する想定
 */
export type SingleTrackModalArgs = Readonly<{
  /** 前後ボタンで遷移可能な、全ての曲の ID */
  trackIds: ReadonlyArray<number>;

  /** 最初に表示する曲の、trackIds での位置 */
  defaultIndex: number;

  /**
   * Modal を閉じる関数
   *
   * 曲情報が編集されて DB に保存された場合は、saved を true にする
   */
  close: (saved: boolean) => void;
}>;

/**
 * SingleTrackModal を開くときの引数
 */
export type OpenSingleTrackModalArgs = Readonly<{
  /** 前後ボタンで遷移可能な、全ての曲の ID */
  trackIds: ReadonlyArray<number>;

  /** 最初に表示する曲の、trackIds での位置 */
  defaultIndex: number;

  /**
   * Modal が閉じられたときの処理
   *
   * 曲情報が編集されて DB に保存された場合は、saved が true になる
   */
  onClosed?: (saved: boolean) => unknown;
}>;

/**
 * SingleTrackModal の状態を親コンポーネントで保持する hook
 */
export function useSingleTrackModal(): {
  /** SingleTrackModal の状態。開いてない場合は undefined */
  modalArgs: SingleTrackModalArgs | undefined;

  /** SingleTrackModal を開く関数 */
  open: (args: OpenSingleTrackModalArgs) => void;
} {
  const [modalArgs, setModalArgs] = useState<
    SingleTrackModalArgs | undefined
  >();

  const open = useCallback(
    ({ trackIds, defaultIndex, onClosed }: OpenSingleTrackModalArgs) => {
      setModalArgs({
        trackIds,
        defaultIndex,
        close: (saved: boolean) => {
          setModalArgs(undefined);

          if (onClosed) {
            onClosed(saved);
          }
        },
      });
    },
    [],
  );

  return { modalArgs, open };
}
