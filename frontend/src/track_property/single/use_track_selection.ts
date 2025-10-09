import { useCallback, useEffect, useState } from "react";
import {
  getSingleTrackProp,
  SingleTrackProperty,
} from "../../gen/backend_api.ts";

/** 曲 ID リストでの選択位置と、その曲の初期プロパティを管理する hook */
export function useTrackSelection({ trackIds, defaultIndex, setFormState }: {
  /** 前後ボタンで遷移可能な、全ての曲の ID */
  trackIds: ReadonlyArray<number>;

  /** ページを表示し始めたときの、trackIds での位置 */
  defaultIndex: number;

  /** 画面の入力欄へ、読み込んだ曲プロパティの初期値を反映する関数 */
  setFormState?: (state: SingleTrackProperty) => unknown;
}): {
  /**
   * 現在の曲の、DB に保存されている初期値
   *
   * 読み込みが完了していなければ undefined
   */
  dbTrackProperty: SingleTrackProperty | undefined;

  currentIndex: number;

  moveToPrevTrack: () => Promise<void>;
  moveToNextTrack: () => Promise<void>;
  onSaved: (savedData: SingleTrackProperty) => void;
} {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    state: "init",
    index: defaultIndex,
  });

  const startLoading = useCallback(async (newIndex: number) => {
    const newId = trackIds.at(newIndex);
    if (newId === undefined) {
      throw new Error("Track index is out of range: " + newIndex);
    }

    // 前のデータを読み込み中なら中止
    if (loadingState.state === "loading") {
      loadingState.abortController.abort();
    }

    const abortController = new AbortController();

    // 「読み込み中」状態にセット
    setLoadingState({
      state: "loading",
      index: newIndex,
      abortController,
    });

    // 曲情報を読み込む
    try {
      const response = await getSingleTrackProp(newId, {
        signal: abortController.signal,
      });

      // 完了したら曲情報と共に状態をセット
      if (!abortController.signal.aborted) {
        setLoadingState({
          state: "completed",
          index: newIndex,
          dbTrackProperty: response.data,
        });

        // 画面の入力欄にも反映
        setFormState?.(response.data);
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        // abort された場合は何もしない (正常な動作)
      } else {
        setLoadingState({
          state: "error",
          index: newIndex,
        });

        throw error;
      }
    }
  }, [trackIds, loadingState, setFormState]);

  // Modal を開いた直後の、最初のデータの読み込みを開始
  useEffect(() => {
    if (loadingState.state === "init") {
      startLoading(loadingState.index);
    }
  }, [loadingState, startLoading]);

  const moveToPrevTrack = useCallback(async () => {
    await startLoading(loadingState.index - 1);
  }, [startLoading, loadingState.index]);
  const moveToNextTrack = useCallback(async () => {
    await startLoading(loadingState.index + 1);
  }, [startLoading, loadingState.index]);

  // 編集データがサーバーに保存された場合、とりあえず dbTrackProperty をそのまま保存データで置き換える
  // (再読込した場合、現状の機構だとスクロール・タブ位置などもリセットされて面倒なので)
  const onSaved = useCallback((savedData: SingleTrackProperty) => {
    setLoadingState((oldState) => {
      if (oldState.state === "completed") {
        return { ...oldState, dbTrackProperty: savedData };
      } else {
        return oldState;
      }
    });
  }, []);

  return {
    dbTrackProperty: loadingState.dbTrackProperty,
    currentIndex: loadingState.index,
    moveToPrevTrack,
    moveToNextTrack,
    onSaved,
  };
}

/** 曲プロパティの初期値の読み込み状態 */
type LoadingState = Readonly<
  {
    // コンポーネント生成直後の、読み込み開始前
    state: "init";
    index: number;
    dbTrackProperty?: undefined;
  } | {
    // 曲を読み込み中
    state: "loading";
    index: number;
    abortController: AbortController;
    dbTrackProperty?: undefined;
  } | {
    // 読み込み完了
    state: "completed";
    index: number;
    dbTrackProperty: SingleTrackProperty;
  } | {
    state: "error";
    index: number;
    dbTrackProperty?: undefined;
  }
>;
