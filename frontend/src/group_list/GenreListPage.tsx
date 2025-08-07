import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetGenreList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { ArtistListPage } from "./ArtistListPage.tsx";

export const GenreListPage: React.FC<{
  filterParams?: {
    artist?: string;
    album?: string;
    genre?: string;
  };
}> = ({
  filterParams,
}) => {
  const { data, error, isLoading } = useGetGenreList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData) => {
    const currentFilter = filterParams ?? {};

    // アーティスト選択画面に遷移
    pushPage({
      render: () => (
        <ArtistListPage
          filterParams={{ ...currentFilter, genre: item.name }}
        />
      ),
      navigationMenuKey: undefined,
      breadCrumb: nextBreadCrumb(item),
    });
  };

  return (
    <GroupListLayout
      list_data={data?.data}
      error={error}
      isLoading={isLoading}
      emptyItemText={UNKNOWN_GENRE}
      onItemClick={handleItemClick}
    />
  );
};

const UNKNOWN_GENRE = "不明なジャンル";

/** リスト要素が選択されて次画面に遷移するときの、パンくずリストに表示する名前 */
function nextBreadCrumb(item: GroupListItemData): string | undefined {
  if (item.name === "") {
    return UNKNOWN_GENRE;
  } else {
    return item.name;
  }
}
