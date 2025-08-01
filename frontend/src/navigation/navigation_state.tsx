import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { PageCommandGroupList } from "../group_list/GroupListPage.tsx";
import { PageCommandTestTagGroup } from "../test_tag_group/TestTagGroupPage.tsx";

/** アプリ全体のナビゲーションの状態を保持するオブジェクト */
export type NavigationState = Readonly<{
  pageStack: ReadonlyArray<PageCommand>;
}>;

/**
 * ページ一つを開くための情報
 *
 * このオブジェクトが `NavigationState.pageStack` に積まれ、戻るボタンやパンくずリストの機能に使用される。
 */
export type PageCommand = PageCommandGroupList | PageCommandTestTagGroup;

function defaultNavigationState(): NavigationState {
  return {
    pageStack: [],
  };
}

const navigationStateContext = createContext<NavigationState | undefined>(
  undefined,
);

export type NavigationStateSetter = Dispatch<SetStateAction<NavigationState>>;

const setNavigationStateContext = createContext<
  NavigationStateSetter | undefined
>(
  undefined,
);

/** NavigationState の context provider */
export const NavigationStateProvider: React.FC<{ children: ReactNode }> = (
  { children },
) => {
  const [state, setState] = useState<NavigationState>(defaultNavigationState);

  return (
    <navigationStateContext.Provider value={state}>
      <setNavigationStateContext.Provider value={setState}>
        {children}
      </setNavigationStateContext.Provider>
    </navigationStateContext.Provider>
  );
};

/** NavigationState を取得するフック */
export function useNavigationState(): NavigationState {
  const state = useContext(navigationStateContext);

  if (state === undefined) {
    throw new Error("navigationStateContext is not provided");
  }

  return state;
}

/** NavigationState の setter を取得するフック */
export function useSetNavigationState(): NavigationStateSetter {
  const setState = useContext(setNavigationStateContext);

  if (setState === undefined) {
    throw new Error("navigationStateContext is not provided");
  }

  return setState;
}
