// ナビゲーションの各種機能のフック群

import { produce } from "immer";
import { useCallback } from "react";
import {
  PageStackItem,
  useNavigationState,
  useSetNavigationState,
} from "./navigation_state.tsx";

/** ページを開き、ページスタックを一つ深くする関数を返すフック */
export function usePushPage(): (stackItem: PageStackItem) => void {
  const setNavigationState = useSetNavigationState();

  return useCallback((stackItem: PageStackItem) => {
    setNavigationState((old) => ({
      ...old,
      pageStack: [...old.pageStack, stackItem],
    }));
  }, []);
}

/** ページスタックを一つ戻る関数を返すフック */
export function usePopPage(): () => void {
  const setNavigationState = useSetNavigationState();

  return useCallback(() => {
    setNavigationState((old) => ({
      ...old,
      pageStack: old.pageStack.slice(0, -1),
    }));
  }, []);
}

/**
 * `PageStackItem.pageState` を取得・設定するフック
 */
export function usePageState<T>(): [
  T | undefined,
  (state: T | undefined) => void,
] {
  const navigationState = useNavigationState();
  const setNavigationState = useSetNavigationState();

  const pageState = navigationState.pageStack.at(-1)?.pageState as
    | T
    | undefined;

  const setPageState = useCallback((newPageState: T | undefined) => {
    setNavigationState((oldNavState) =>
      produce(oldNavState, (draft) => {
        const currentPage = draft.pageStack.at(-1);
        if (currentPage === undefined) {
          throw new Error("setPageState error : pages is empty.");
        }

        currentPage.pageState = newPageState;
      })
    );
  }, [setNavigationState]);

  return [pageState, setPageState];
}
