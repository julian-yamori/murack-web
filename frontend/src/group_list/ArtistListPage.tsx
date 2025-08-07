import { GroupListLayout } from "./GroupListLayout.tsx";
import {
  type GroupListItem as GroupListItemData,
  useGetArtistList,
} from "../gen/backend_api.ts";
import { usePushPage } from "../navigation/navigation_hooks.ts";
import { AlbumListPage } from "./AlbumListPage.tsx";

export const ArtistListPage: React.FC<{
  filterParams?: {
    artist?: string;
    album?: string;
    genre?: string;
  };
}> = ({
  filterParams,
}) => {
  const { data, error, isLoading } = useGetArtistList(filterParams);
  const pushPage = usePushPage();

  const handleItemClick = (item: GroupListItemData) => {
    const currentFilter = filterParams ?? {};

    // アルバム選択画面に遷移
    pushPage({
      render: () => (
        <AlbumListPage filterParams={{ ...currentFilter, artist: item.name }} />
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
      emptyItemText={UNKNOWN_ARTIST}
      onItemClick={handleItemClick}
    />
  );
};

const UNKNOWN_ARTIST = "不明なアーティスト";

/** リスト要素が選択されて次画面に遷移するときの、パンくずリストに表示する名前 */
function nextBreadCrumb(item: GroupListItemData): string | undefined {
  if (item.name === "") {
    return UNKNOWN_ARTIST;
  } else {
    return item.name;
  }
}
