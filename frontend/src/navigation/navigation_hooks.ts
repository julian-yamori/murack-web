// ナビゲーションの各種機能のフック群

import { useCallback } from "react";
import { PageCommand, useSetNavigationState } from "./navigation_state.tsx";

/** ページを開き、ページスタックを一つ深くする関数を返すフック */
export function usePushPage(): (command: PageCommand) => void {
  const setNavigationState = useSetNavigationState();

  return useCallback((command: PageCommand) => {
    setNavigationState((old) => ({
      ...old,
      pageStack: [...old.pageStack, command],
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
