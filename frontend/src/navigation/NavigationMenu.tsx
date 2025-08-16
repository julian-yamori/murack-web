import { Divider, ListItemText, MenuItem, MenuList } from "@mui/material";
import {
  PageStackItem,
  useNavigationState,
  useSetNavigationState,
} from "./navigation_state.tsx";
import { ArtistListPage } from "../group_list/ArtistListPage.tsx";
import { TestTagGroupPage } from "../test_tag_group/TestTagGroupPage.tsx";
import { AlbumListPage } from "../group_list/AlbumListPage.tsx";
import { GenreListPage } from "../group_list/GenreListPage.tsx";
import { RootListPage } from "../playlist/RootListPage.tsx";

/** ナビゲーションメニューで、どの項目が選択されているかを判別するためのキー */
export type NavigationMenuKey =
  | "playlist"
  | "artist"
  | "album"
  | "genre"
  | "test-tag-group";

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
        text="プレイリスト"
        selected={currentPage?.navigationMenuKey === "playlist"}
        onClick={() =>
          changeRootPage({
            render: () => <RootListPage />,
            navigationMenuKey: "playlist",
            breadCrumb: "プレイリスト",
          })}
      />
      <PageItem
        text="アーティスト"
        selected={currentPage?.navigationMenuKey === "artist"}
        onClick={() =>
          changeRootPage({
            render: () => <ArtistListPage />,
            navigationMenuKey: "artist",
            breadCrumb: "アーティスト",
          })}
      />
      <PageItem
        text="アルバム"
        selected={currentPage?.navigationMenuKey === "album"}
        onClick={() =>
          changeRootPage({
            render: () => <AlbumListPage />,
            navigationMenuKey: "album",
            breadCrumb: "アルバム",
          })}
      />
      <PageItem
        text="ジャンル"
        selected={currentPage?.navigationMenuKey === "genre"}
        onClick={() =>
          changeRootPage({
            render: () => <GenreListPage />,
            navigationMenuKey: "genre",
            breadCrumb: "ジャンル",
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
