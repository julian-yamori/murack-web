import { Divider, ListItemText, MenuItem, MenuList } from "@mui/material";
import {
  PageCommand,
  useNavigationState,
  useSetNavigationState,
} from "./navigation_state.tsx";

/// AppBar から呼び出す、最上位の各種ページに遷移するメニュー
export const NavigationMenu: React.FC<{
  /** メニューを閉じたいときにこのコンポーネントから呼ばれる */
  onClose: () => unknown;
}> = ({ onClose }) => {
  const navigationState = useNavigationState();
  const setNavigationState = useSetNavigationState();

  const currentPage = navigationState.pageStack.at(-1);

  /** ページスタックの最上位を、メニューで選択されたページに置き換える */
  const changeRootPage = (command: PageCommand) => {
    setNavigationState((old) => ({
      ...old,
      pageStack: [command],
    }));

    onClose();
  };

  return (
    <MenuList>
      <PageItem
        text="アーティスト"
        selected={currentPage?.type === "group-list"}
        onClick={() => changeRootPage({ type: "group-list", depth: 1 })}
      />
      <Divider />

      <PageItem
        text="タググループリスト（仮）"
        selected={currentPage?.type === "test-tag-group"}
        onClick={() => changeRootPage({ type: "test-tag-group" })}
      />
    </MenuList>
  );
};

/** ページを開くメニュー項目 */
const PageItem: React.FC<
  { text: string; selected: boolean; onClick: (e: React.MouseEvent) => unknown }
> = ({ text, selected, onClick }) => {
  return (
    <MenuItem selected={selected} onClick={onClick}>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};
