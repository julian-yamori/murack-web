import { Divider, ListItemText, MenuItem, MenuList } from "@mui/material";
import {
  PageStackItem,
  useNavigationState,
  useSetNavigationState,
} from "./navigation_state.tsx";
import { GroupListPage } from "../group_list/GroupListPage.tsx";
import { TestTagGroupPage } from "../test_tag_group/TestTagGroupPage.tsx";

/** ナビゲーションメニューで、どの項目が選択されているかを判別するためのキー */
export type NavigationMenuKey = "group-list" | "test-tag-group";

/// AppBar から呼び出す、最上位の各種ページに遷移するメニュー
export const NavigationMenu: React.FC<{
  /** メニューを閉じたいときにこのコンポーネントから呼ばれる */
  onClose: () => unknown;
}> = ({ onClose }) => {
  const navigationState = useNavigationState();
  const setNavigationState = useSetNavigationState();

  const currentPage = navigationState.pageStack.at(-1);

  /** ページスタックの最上位を、メニューで選択されたページに置き換える */
  const changeRootPage = (stackItem: PageStackItem) => {
    setNavigationState((old) => ({
      ...old,
      pageStack: [stackItem],
    }));

    onClose();
  };

  return (
    <MenuList>
      <PageItem
        text="アーティスト"
        selected={currentPage?.navigationMenuKey === "group-list"}
        onClick={() =>
          changeRootPage({
            render: () => <GroupListPage depth={1} />,
            navigationMenuKey: "group-list",
            breadCrumb: "アーティスト",
          })}
      />
      <Divider />

      <PageItem
        text="タググループリスト（仮）"
        selected={currentPage?.navigationMenuKey === "test-tag-group"}
        onClick={() =>
          changeRootPage({
            render: () => <TestTagGroupPage />,
            navigationMenuKey: "test-tag-group",
            breadCrumb: "タググループ一覧",
          })}
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
